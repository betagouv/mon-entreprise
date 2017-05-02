import R from 'ramda'
import {parentName, nameLeaf, findRuleByDottedName, splitName, joinName} from './rules'


let evaluateBottomUp = situationGate => startingFragments => {
	let rec = (parentFragments, childFragments=[]) =>
		parentFragments.length == 0 ? null
		: ( do {
				let query = joinName(parentFragments),
					expectedResult = ( R.isEmpty(childFragments) ? 'oui' : joinName(childFragments) )

				situationGate(query) == null ?
					rec(
						R.dropLast(1)(parentFragments),
						[ R.last(parentFragments), ...childFragments]
					)
				: situationGate(query) == expectedResult
		})
	return rec(startingFragments)
}


export let evaluateVariable = (situationGate, variableName, format) => {
	// test rec
	let value = situationGate(variableName)
	return format != null ?
    	(value == undefined ? null : value)
		: evaluateBottomUp(situationGate)(splitName(variableName))
}
