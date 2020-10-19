import { add, evolve, fromPairs, keys, map, mergeWith, reduce } from 'ramda'
import React from 'react'
import { typeWarning } from './error'
import {
	evaluateReference,
	evaluateReferenceTransforms
} from './evaluateReference'
import {
	evaluateCondition,
	evaluateDisabledBy,
	evaluateFormula,
	evaluateRule
} from './evaluateRule'
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
import { EvaluatedNode } from './types'

export const makeJsx = (node: EvaluatedNode): JSX.Element => {
	const Component = node.jsx
	return <Component {...node} />
}

export const collectNodeMissing = node => node.missingVariables || {}

export const bonus = (missings, hasCondition = true) =>
	hasCondition ? map(x => x + 0.0001, missings || {}) : missings
export const mergeAllMissing = missings =>
	missings.map(collectNodeMissing).reduce(mergeMissing, {})
export const mergeMissing = (left, right) =>
	mergeWith(add, left || {}, right || {})

export const evaluateNode = (cache, situation, parsedRules, node) => {
	if (!node.nodeKind) {
		throw Error('A node to evaluate must have a "nodeKind" attribute')
	} else if (!evaluationFunctions[node.nodeKind]) {
		throw Error(`Unknown "nodeKind": ${node.nodeKind}`)
	}
	return evaluationFunctions[node.nodeKind](cache, situation, parsedRules, node)
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

export const defaultNode = (nodeValue: EvaluatedNode['nodeValue']) => ({
	nodeValue,
	// eslint-disable-next-line
	jsx: ({ nodeValue }: EvaluatedNode) => (
		<span className="value">{nodeValue}</span>
	),
	isDefault: true,
	nodeKind: 'defaultNode'
})

const evaluateDefaultNode = (cache, situation, parsedRules, node) => node
const evaluateExplanationNode = (cache, situation, parsedRules, node) =>
	evaluateNode(cache, situation, parsedRules, node.explanation)

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

const evaluationFunctions = {
	rule: evaluateRule,
	formula: evaluateFormula,
	disabledBy: evaluateDisabledBy,
	condition: evaluateCondition,
	reference: evaluateReference,
	referenceWithTransforms: evaluateReferenceTransforms,
	parentDependencies: evaluateExplanationNode,
	constant: evaluateDefaultNode,
	defaultNode: evaluateDefaultNode
}

export function registerEvaluationFunction(nodeKind, evaluationFunction) {
	if (evaluationFunctions[nodeKind]) {
		throw Error(
			`Multiple evaluation functions registered for the nodeKind \x1b[4m${nodeKind}`
		)
	}
	evaluationFunctions[nodeKind] = evaluationFunction
}
