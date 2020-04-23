import { dropLast, isEmpty, last } from 'ramda'
import { joinName, splitName } from './ruleUtils'

let evaluateBottomUp = situationGate => startingFragments => {
	let rec = (parentFragments, childFragments = []) =>
		parentFragments.length == 0
			? null
			: (function() {
					let query = joinName(parentFragments),
						expectedResult = isEmpty(childFragments)
							? 'oui'
							: joinName(childFragments)

					return situationGate(query) == null
						? rec(dropLast(1)(parentFragments), [
								last(parentFragments),
								...childFragments
						  ])
						: situationGate(query) == expectedResult
			  })()

	return rec(startingFragments)
}
export let getSituationValue = (situationGate, variableName, rule) => {
	// get the current situation value
	// it's the user input or test input, possibly with default values
	let value = situationGate(variableName)

	if (rule.formule && rule.formule['une possibilité'])
		return evaluateBottomUp(situationGate)(splitName(variableName))

	return value
}
