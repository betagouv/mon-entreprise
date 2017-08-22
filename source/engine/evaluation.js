import R from 'ramda'

export let makeJsx = node =>
	typeof node.jsx == "function"
		? node.jsx(node.nodeValue, node.explanation)
		: node.jsx

export let collectNodeMissing = (node) =>
	node.collectMissing ? node.collectMissing(node) : []

export let evaluateNode = (situationGate, parsedRules, node) =>
	node.evaluate ? node.evaluate(situationGate, parsedRules, node) : node

export let rewriteNode = (node, nodeValue, explanation, collectMissing) =>
	({
		...node,
		nodeValue,
		collectMissing,
		explanation
	})

export let evaluateArray = (reducer, start) => (situationGate, parsedRules, node) => {
	let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
	    explanation = R.map(evaluateOne, node.explanation),
		values = R.pluck("nodeValue",explanation),
		nodeValue = R.any(R.equals(null),values) ? null : R.reduce(reducer, start, values)

	let collectMissing = node => node.nodeValue == null ? R.chain(collectNodeMissing,node.explanation) : []
	return rewriteNode(node,nodeValue,explanation,collectMissing)
}

export let evaluateArrayWithFilter = (filter, reducer, start) => (situationGate, parsedRules, node) => {
	let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
	    explanation = R.map(evaluateOne, R.filter(filter(situationGate),node.explanation)),
		values = R.pluck("nodeValue",explanation),
		nodeValue = R.any(R.equals(null),values) ? null : R.reduce(reducer, start, values)

	let collectMissing = node => R.chain(collectNodeMissing,node.explanation)
	return rewriteNode(node,nodeValue,explanation,collectMissing)
}

export let parseObject = (recurse, objectShape, value) => {
	let recurseOne = key => defaultValue => {
			if (!value[key] && ! defaultValue) throw "Il manque une valeur '"+key+"'"
			return value[key] ? recurse(value[key]) : defaultValue
		}
	let transforms = R.fromPairs(R.map(k => [k,recurseOne(k)],R.keys(objectShape)))
	return R.evolve(transforms,objectShape)
}

export let evaluateObject = (objectShape, effect) => (situationGate, parsedRules, node) => {
	let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
		collectMissing = node => R.chain(collectNodeMissing,R.values(node.explanation))

	let transforms = R.map(k => [k,evaluateOne], R.keys(objectShape)),
	    explanation = R.evolve(R.fromPairs(transforms))(node.explanation),
	    nodeValue = effect(explanation)
	return rewriteNode(node,nodeValue,explanation,collectMissing)
}
