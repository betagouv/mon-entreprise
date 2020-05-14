import { dropLast, isEmpty, last } from 'ramda'
import { joinName, splitName } from './ruleUtils'

let evaluateBottomUp = situation => startingFragments => {
	let rec = (parentFragments, childFragments = []) =>
		parentFragments.length == 0
			? null
			: (function() {
					let query = joinName(parentFragments),
						expectedResult = isEmpty(childFragments)
							? 'oui'
							: joinName(childFragments)

					return situation[query] == null
						? rec(dropLast(1)(parentFragments), [
								last(parentFragments),
								...childFragments
						  ])
						: situation[query] == expectedResult
			  })()

	return rec(startingFragments)
}
export let getSituationValue = (situation, variableName, rule) => {
	// get the current situation value
	// it's the user input or test input, possibly with default values
	let value = situation[variableName]

	if (rule.formule?.['une possibilité'])
		return evaluateBottomUp(situation)(splitName(variableName))

	return value
}
