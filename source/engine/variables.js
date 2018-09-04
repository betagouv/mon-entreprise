import { isEmpty, dropLast, last } from 'ramda'
import { splitName, joinName } from './rules'

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

/* Evalue la valeur d'une variable
en utilisant la fonction situationGate qui donne accès à la situation courante*/
export let evaluateVariable = (situationGate, variableName, rule) => {
	// test rec
	let value = situationGate(variableName)

	if (rule.format != null) return value
	//boolean variables don't have a format prop, it's the default
	if (formatBooleanValue[value] !== undefined) return formatBooleanValue[value]
	if (rule.formule && rule.formule['une possibilité'])
		return evaluateBottomUp(situationGate)(splitName(variableName))

	return value
}
