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
import { typeWarning } from './error'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'
import {
	concatTemporals,
	liftTemporalNode,
	mapTemporal,
	pureTemporal,
	temporalAverage,
	zipTemporals
} from './period'

export let makeJsx = node =>
	typeof node.jsx == 'function'
		? node.jsx(node.nodeValue, node.explanation, node.lazyEval, node.unit)
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
	if (typeof evaluatedNode.nodeValue !== 'number') {
		return evaluatedNode
	}
	evaluatedNode = node.unité
		? convertNodeToUnit(node.unit, evaluatedNode)
		: simplifyNodeUnit(evaluatedNode)
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
	if (!evaluatedNodes.every(Boolean)) {
		console.log(node.explanation)
	}
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
	let transforms = fromPairs(map(k => [k, recurseOne(k)], keys(objectShape)))
	return evolve(transforms, objectShape)
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

	const sameUnitTemporalExplanation = convertNodesToSameUnit(
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
	if (nodeValue === 495) {
		console.log(temporalValue)
	}
	const baseEvaluation = {
		...node,
		nodeValue,
		unit: sameUnitTemporalExplanation[0].value.unit,
		explanation: evaluations
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
