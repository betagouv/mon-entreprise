import {
	add,
	evolve,
	filter,
	fromPairs,
	keys,
	map,
	mergeWith,
	reduce
} from 'ramda'
import React from 'react'
import { typeWarning } from './error'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'
import { EvaluatedNode } from 'Engine/types'
import {
	concatTemporals,
	liftTemporalNode,
	mapTemporal,
	pureTemporal,
	Temporal,
	temporalAverage,
	zipTemporals
} from './temporal'
import { ParsedRule, ParsedRules } from './types'

export let makeJsx = node =>
	typeof node.jsx == 'function'
		? node.jsx(node.nodeValue, node.explanation, node.unit)
		: node.jsx

export let collectNodeMissing = node => node.missingVariables || {}

export let bonus = (missings, hasCondition = true) =>
	hasCondition ? map(x => x + 0.0001, missings || {}) : missings
export let mergeAllMissing = missings =>
	reduce(mergeWith(add), {}, map(collectNodeMissing, missings))
export let mergeMissing = (left, right) =>
	mergeWith(add, left || {}, right || {})

export let evaluateNode = (cache, situationGate, parsedRules, node) => {
	let evaluatedNode = node.evaluate
		? node.evaluate(cache, situationGate, parsedRules, node)
		: node
	return evaluatedNode
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
	situationGate,
	parsedRules,
	node
) => {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)
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
		unit: evaluatedNodes[0].unit
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
	situationGate,
	parsedRules,
	node
) => {
	return evaluateArray(reducer, start)(cache, situationGate, parsedRules, {
		...node,
		explanation: filter(evaluationFilter(situationGate), node.explanation)
	})
}

export let defaultNode = nodeValue => ({
	nodeValue,
	// eslint-disable-next-line
	jsx: nodeValue => <span className="value">{nodeValue}</span>,
	isDefault: true
})

export let parseObject = (recurse, objectShape, value) => {
	let recurseOne = key => defaultValue => {
		if (value[key] == null && !defaultValue)
			throw new Error(
				`Il manque une clé '${key}' dans ${JSON.stringify(value)} `
			)
		return value[key] != null ? recurse(value[key]) : defaultValue
	}
	let transforms = fromPairs(
		map(k => [k, recurseOne(k)], keys(objectShape)) as any
	)
	return evolve(transforms as any, objectShape)
}

export let evaluateObject = (objectShape, effect) => (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)
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
		const evaluation = effect(explanations, cache, situationGate, parsedRules)
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

type DefaultValues<Names extends string> = { [name in Names]: any } | {}
export function collectDefaults<Names extends string>(
	parsedRules: ParsedRules<Names>
): DefaultValues<Names> {
	const cache = { _meta: { contextRule: [] as string[] } }
	return (Object.values(parsedRules) as Array<ParsedRule<Names>>).reduce(
		(acc, parsedRule) => {
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
