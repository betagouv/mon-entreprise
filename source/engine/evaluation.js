import {
	map,
	pluck,
	any,
	equals,
	reduce,
	chain,
	length,
	flatten,
	uniq,
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

export let collectNodeMissing = node => node.missingVariables || []

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
		missingVariables = node.nodeValue == null
			? map(collectNodeMissing, explanation)
			: []
//	console.log("".padStart(cache.parseLevel),map(node => length(flatten(collectNodeMissing(node))) ,explanation))
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
		missingVariables = node.nodeValue == null
			// TODO - this works by coincidence, composantes are usually of a computation
			// where missing variables are shared
			? uniq(map(collectNodeMissing, explanation))
			: []

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
		missingVariables = map(collectNodeMissing, values(explanation))
//	console.log("".padStart(cache.parseLevel),map(node => length(flatten(collectNodeMissing(node))) ,explanation))
	return rewriteNode(node, nodeValue, explanation, missingVariables)
}
