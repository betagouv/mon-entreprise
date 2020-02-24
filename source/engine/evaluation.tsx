import {
	add,
	any,
	equals,
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
	periodAverage,
	pure,
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
const sameUnitValues = (explanation, contextRule, mecanismName) => {
	const firstNodeWithUnit = explanation.find(node => !!node.unit)
	if (!firstNodeWithUnit) {
		return [undefined, explanation.map(({ nodeValue }) => nodeValue)]
	}
	const values = explanation.map(node => {
		try {
			return convertNodeToUnit(firstNodeWithUnit?.unit, node).nodeValue
		} catch (e) {
			typeWarning(
				contextRule,
				`Dans le mécanisme ${mecanismName}, les unités des éléments suivants sont incompatibles entre elles : \n\t\t${node?.name ||
					node?.rawNode}\n\t\t${firstNodeWithUnit?.name ||
					firstNodeWithUnit?.rawNode}'`,
				e
			)
			return node.nodeValue
		}
	})
	return [firstNodeWithUnit.unit, values]
}

export let evaluateArray = (reducer, start) => (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)
	const temporalExplanation = concatTemporals(
		node.explanation.map(evaluate).map(liftTemporalNode)
	)
	const temporalEvaluations = mapTemporal(explanation => {
		explanation
		const [unit, values] = sameUnitValues(
			explanation,
			cache._meta.contextRule,
			node.name
		)
		const nodeValue = values.some(value => value === null)
			? null
			: reduce(reducer, start, values)
		const missingVariables =
			node.nodeValue == null ? mergeAllMissing(explanation) : {}
		return {
			...node,
			nodeValue,
			explanation,
			missingVariables,
			unit
		}
	}, temporalExplanation)
	if (temporalEvaluations.length === 1) {
		return temporalEvaluations[0]
	}
	const temporalValue = mapTemporal(node => node.nodeValue, temporalEvaluations)
	return {
		...node,
		temporalValue,
		nodeValue: periodAverage(temporalValue)
	}
}

export let evaluateArrayWithFilter = (evaluationFilter, reducer, start) => (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	let evaluateOne = child =>
			evaluateNode(cache, situationGate, parsedRules, child),
		explanation = map(
			evaluateOne,
			filter(evaluationFilter(situationGate), node.explanation)
		),
		[unit, values] = sameUnitValues(
			explanation,
			cache._meta.contextRule,
			node.name
		),
		nodeValue = any(equals(null), values)
			? null
			: reduce(reducer, start, values),
		missingVariables =
			node.nodeValue == null ? mergeAllMissing(explanation) : {}

	return { ...node, nodeValue, explanation, missingVariables, unit }
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
				zipTemporals(pure(key), liftTemporalNode(node))
			)
		)
	)
	const temporalEvaluations = mapTemporal(
		explanations => effect(explanations, cache, situationGate, parsedRules),
		temporalExplanations
	)

	const temporalValue = mapTemporal(
		evaluation =>
			evaluation !== null && typeof evaluation === 'object'
				? evaluation.nodeValue
				: evaluation,
		temporalEvaluations
	)
	const nodeValue = periodAverage(temporalValue)

	return simplifyNodeUnit({
		...node,
		nodeValue,
		...(temporalEvaluations.length > 1
			? { temporalValue }
			: {
					missingVariables: mergeAllMissing(Object.values(evaluations)),
					explanation: {
						...evaluations,
						...temporalEvaluations[0].additionalExplanation
					},
					unit: temporalEvaluations[0].unit
			  })
	})
}
