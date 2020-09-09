import {
	add,
	evolve,
	filter,
	fromPairs,
	keys,
	map,
	mergeWith,
	reduce,
	dissoc
} from 'ramda'
import React from 'react'
import { typeWarning } from './error'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'
import {
	concatTemporals,
	liftTemporalNode,
	mapTemporal,
	pureTemporal,
	Temporal,
	temporalAverage,
	zipTemporals
} from './temporal'
import { EvaluatedNode, ParsedRule, ParsedRules } from './types'

export const makeJsx = (node: EvaluatedNode): JSX.Element => {
	const Component = node.jsx
	return <Component {...node} />
}

export const collectNodeMissing = node => node.missingVariables || {}

export const bonus = (missings, hasCondition = true) =>
	hasCondition ? map(x => x + 0.0001, missings || {}) : missings
export const mergeAllMissing = missings =>
	reduce(mergeWith(add), {}, map(collectNodeMissing, missings))
export const mergeMissing = (left, right) =>
	mergeWith(add, left || {}, right || {})

export const evaluateNode = (cache, situation, parsedRules, node) => {
	return node.evaluate(cache, situation, parsedRules, node)
}

function convertNodesToSameUnit(nodes, contextRule, mecanismName) {
	const firstNodeWithUnit = nodes.find(node => !!node.unit)
	if (!firstNodeWithUnit) {
		return nodes
	}
	return nodes.map(node => {
		try {
			return convertNodeToUnit(firstNodeWithUnit.unit, node)
		} catch (e) {
			typeWarning(
				contextRule,
				`Dans le mécanisme ${mecanismName}, les unités des éléments suivants sont incompatibles entre elles : \n\t\t${node?.name ||
					node?.rawNode}\n\t\t${firstNodeWithUnit?.name ||
					firstNodeWithUnit?.rawNode}'`,
				e
			)
			return node
		}
	})
}

export const evaluateArray = (reducer, start) => (
	cache,
	situation,
	parsedRules,
	node
) => {
	const evaluate = evaluateNode.bind(null, cache, situation, parsedRules)
	const evaluatedNodes = convertNodesToSameUnit(
		node.explanation.map(evaluate),
		cache._meta.contextRule,
		node.name
	)

	const temporalValues = concatTemporals(
		evaluatedNodes.map(
			({ temporalValue, nodeValue }) => temporalValue ?? pureTemporal(nodeValue)
		)
	)
	const temporalValue = mapTemporal(values => {
		if (values.some(value => value === null)) {
			return null
		}
		return reduce(reducer, start, values)
	}, temporalValues)

	const baseEvaluation = {
		...node,
		missingVariables: mergeAllMissing(evaluatedNodes),
		explanation: evaluatedNodes,
		...(evaluatedNodes[0] && { unit: evaluatedNodes[0].unit })
	}
	if (temporalValue.length === 1) {
		return {
			...baseEvaluation,
			nodeValue: temporalValue[0].value
		}
	}
	return {
		...baseEvaluation,
		temporalValue,
		nodeValue: temporalAverage(temporalValue)
	}
}

export const evaluateArrayWithFilter = (evaluationFilter, reducer, start) => (
	cache,
	situation,
	parsedRules,
	node
) => {
	return evaluateArray(reducer, start)(
		cache,
		dissoc('_meta.filter', situation),
		parsedRules,
		{
			...node,
			explanation: filter(evaluationFilter(situation), node.explanation)
		}
	)
}

export const defaultNode = (nodeValue: EvaluatedNode['nodeValue']) => {
	const defaultNode = {
		nodeValue,
		// eslint-disable-next-line
		jsx: ({ nodeValue }: EvaluatedNode) => (
			<span className="value">{nodeValue}</span>
		),
		isDefault: true
	}
	return { ...defaultNode, evaluate: () => defaultNode }
}

export const parseObject = (recurse, objectShape, value) => {
	const recurseOne = key => defaultValue => {
		if (value[key] == null && !defaultValue)
			throw new Error(
				`Il manque une clé '${key}' dans ${JSON.stringify(value)} `
			)
		return value[key] != null ? recurse(value[key]) : defaultValue
	}
	const transforms = fromPairs(
		map(k => [k, recurseOne(k)], keys(objectShape)) as any
	)
	return evolve(transforms as any, objectShape)
}

export const evaluateObject = (objectShape, effect) => (
	cache,
	situation,
	parsedRules,
	node
) => {
	const evaluate = evaluateNode.bind(null, cache, situation, parsedRules)
	const evaluations = map(evaluate, node.explanation)
	const temporalExplanations = mapTemporal(
		Object.fromEntries,
		concatTemporals(
			Object.entries(evaluations).map(([key, node]) =>
				zipTemporals(pureTemporal(key), liftTemporalNode(node))
			)
		)
	)
	const temporalExplanation = mapTemporal(explanations => {
		const evaluation = effect(explanations, cache, situation, parsedRules)
		return {
			...evaluation,
			explanation: {
				...explanations,
				...evaluation.explanation
			}
		}
	}, temporalExplanations)

	const sameUnitTemporalExplanation: Temporal<EvaluatedNode<
		string,
		number
	>> = convertNodesToSameUnit(
		temporalExplanation.map(x => x.value),
		cache._meta.contextRule,
		node.name
	).map((node, i) => ({
		...temporalExplanation[i],
		value: simplifyNodeUnit(node)
	}))

	const temporalValue = mapTemporal(
		({ nodeValue }) => nodeValue,
		sameUnitTemporalExplanation
	)
	const nodeValue = temporalAverage(temporalValue)
	const baseEvaluation = {
		...node,
		nodeValue,
		unit: sameUnitTemporalExplanation[0].value.unit,
		explanation: evaluations,
		missingVariables: mergeAllMissing(Object.values(evaluations))
	}
	if (sameUnitTemporalExplanation.length === 1) {
		return {
			...baseEvaluation,
			explanation: sameUnitTemporalExplanation[0].value.explanation
		}
	}
	return {
		...baseEvaluation,
		temporalValue,
		temporalExplanation
	}
}

type DefaultValues<Names extends string> = Partial<
	Record<Names, number | string | Record<string, unknown>>
>
export function collectDefaults<Names extends string>(
	parsedRules: ParsedRules<Names>
): DefaultValues<Names> {
	const values: Array<ParsedRule<Names>> = Object.values(parsedRules)
	return values.reduce(
		(acc: DefaultValues<Names>, parsedRule: ParsedRule<Names>) => {
			if (parsedRule?.['par défaut'] == null) {
				return acc
			}
			return {
				...acc,
				[parsedRule.dottedName]: parsedRule['par défaut']
			}
		},
		{}
	)
}
