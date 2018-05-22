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

/* Evalue la valeur d'une variable
en utilisant la fonction situationGate qui donne accès à la situation courante*/
export let evaluateVariable = (situationGate, variableName, rule) => {
	// test rec
	let value = situationGate(variableName)

	return rule.format != null
		? value
		: !rule.formule
			? // c'est une variante, eg. motifs . classique . accroissement d'activité
			  evaluateBottomUp(situationGate)(splitName(variableName))
			: rule.formule['une possibilité']
				? evaluateBottomUp(situationGate)(splitName(variableName))
				: value
}
