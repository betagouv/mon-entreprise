import {
	add,
	any,
	equals,
	evolve,
	filter,
	fromPairs,
	is,
	keys,
	map,
	mergeWith,
	reduce,
	values
} from 'ramda'
import React from 'react'
import { typeWarning } from './error'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'

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
	let evaluateOne = child =>
			evaluateNode(cache, situationGate, parsedRules, child),
		explanation = map(evaluateOne, node.explanation),
		[unit, values] = sameUnitValues(
			explanation,
			cache._meta.contextRule,
			node.name
		),
		nodeValue = values.some(value => value === null)
			? null
			: reduce(reducer, start, values),
		missingVariables =
			node.nodeValue == null ? mergeAllMissing(explanation) : {}
	return {
		...node,
		nodeValue,
		explanation,
		missingVariables,
		unit
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
		if (!value[key] && !defaultValue)
			throw new Error(
				`Il manque une valeur '${key}' dans ${JSON.stringify(value)} `
			)
		return value[key] ? recurse(value[key]) : defaultValue
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
	let evaluateOne = child =>
		evaluateNode(cache, situationGate, parsedRules, child)

	let transforms = map(k => [k, evaluateOne], keys(objectShape)),
		automaticExplanation = evolve(fromPairs(transforms))(node.explanation)
	// the result of effect can either be just a nodeValue, or an object {additionalExplanation, nodeValue}. The latter is useful for a richer JSX visualisation of the mecanism : the view should not duplicate code to recompute intermediate values (e.g. for a marginal 'barème', the marginal 'tranche')
	let evaluated = effect(
			automaticExplanation,
			cache,
			situationGate,
			parsedRules
		),
		explanation = is(Object, evaluated)
			? { ...automaticExplanation, ...evaluated.additionalExplanation }
			: automaticExplanation,
		nodeValue = is(Object, evaluated) ? evaluated.nodeValue : evaluated,
		missingVariables = mergeAllMissing(values(explanation))
	return simplifyNodeUnit({
		...node,
		nodeValue,
		explanation,
		missingVariables,
		unit: explanation.unit
	})
}
