import {
	add,
	map,
	pluck,
	any,
	equals,
	reduce,
	mergeWith,
	fromPairs,
	keys,
	values,
	evolve,
	filter
} from 'ramda'

export let makeJsx = node =>
	typeof node.jsx == 'function'
		? node.jsx(node.nodeValue, node.explanation)
		: node.jsx

export let collectNodeMissing = node => node.missingVariables || {}

export let bonus = (missings, hasCondition = true) =>
	hasCondition ? map(x => x + 0.0001, missings || {}) : missings
export let mergeAllMissing = missings =>
	reduce(mergeWith(add), {}, map(collectNodeMissing, missings))
export let mergeMissing = (left, right) =>
	mergeWith(add, left || {}, right || {})

export let evaluateNode = (cache, situationGate, parsedRules, node) =>
	node.evaluate ? node.evaluate(cache, situationGate, parsedRules, node) : node

export let rewriteNode = (node, nodeValue, explanation, missingVariables) => ({
	...node,
	nodeValue,
	explanation,
	missingVariables
})

export let evaluateArray = (reducer, start) => (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	let evaluateOne = child =>
			evaluateNode(cache, situationGate, parsedRules, child),
		explanation = map(evaluateOne, node.explanation),
		values = pluck('nodeValue', explanation),
		nodeValue = any(equals(null), values)
			? null
			: reduce(reducer, start, values),
		missingVariables =
			node.nodeValue == null ? mergeAllMissing(explanation) : {}
	//	console.log("".padStart(cache.parseLevel), missingVariables)
	return rewriteNode(node, nodeValue, explanation, missingVariables)
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
		values = pluck('nodeValue', explanation),
		nodeValue = any(equals(null), values)
			? null
			: reduce(reducer, start, values),
		missingVariables =
			node.nodeValue == null ? mergeAllMissing(explanation) : {}

	return rewriteNode(node, nodeValue, explanation, missingVariables)
}

export let parseObject = (recurse, objectShape, value) => {
	let recurseOne = key => defaultValue => {
		if (!value[key] && !defaultValue) throw "Il manque une valeur '" + key + "'"
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
		explanation = evolve(fromPairs(transforms))(node.explanation),
		nodeValue = effect(explanation),
		missingVariables = mergeAllMissing(values(explanation))
	//	console.log("".padStart(cache.parseLevel),map(node => length(flatten(collectNodeMissing(node))) ,explanation))
	return rewriteNode(node, nodeValue, explanation, missingVariables)
}
