import { dropLast, isEmpty, last } from 'ramda'
import { joinName, splitName } from './rules'

let evaluateBottomUp = situationGate => startingFragments => {
	let rec = (parentFragments, childFragments = []) =>
		parentFragments.length == 0
			? null
			: do {
					let query = joinName(parentFragments),
						expectedResult = isEmpty(childFragments)
							? 'oui'
							: joinName(childFragments)

					situationGate(query) == null
						? rec(dropLast(1)(parentFragments), [
								last(parentFragments),
								...childFragments
						  ])
						: situationGate(query) == expectedResult
			  }

	return rec(startingFragments)
}
let formatBooleanValue = { oui: true, non: false }

export let getSituationValue = (situationGate, variableName, rule) => {
	// get the current situation value
	// it's the user input or test input, possibly with default values
	let value = situationGate(variableName)

	if (rule.API) return typeof value == 'string' ? JSON.parse(value) : value

	if (rule.unit != null) return value
	// a leaf variable with an unit attribute is not boolean
	if (formatBooleanValue[value] !== undefined) return formatBooleanValue[value]
	if (rule.formule && rule.formule['une possibilité'])
		return evaluateBottomUp(situationGate)(splitName(variableName))

	return value
}
