import { evaluateNode } from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import uniroot from '../uniroot'
import InversionNumérique from '../components/mecanisms/InversionNumérique'
import { parseUnit } from '../units'

export const evaluateInversion = (oldCache, situation, parsedRules, node) => {
	// TODO : take applicability into account here
	let inversedWith = node.explanation.inversionCandidates.find(
		n => situation[n.dottedName] != undefined
	)
	if (!inversedWith) {
		return {
			...node,
			missingVariables: {
				...Object.fromEntries(
					node.explanation.inversionCandidates.map(n => [n.dottedName, 1])
				),
				[node.explanation.ruleToInverse]: 1
			},
			nodeValue: null
		}
	}
	inversedWith = evaluateNode(oldCache, situation, parsedRules, inversedWith)
	let inversionCache
	function resetInversionCache() {
		inversionCache = {
			_meta: { ...oldCache._meta }
		}
		return inversionCache
	}
	const evaluateWithValue = (n: number) =>
		evaluateNode(
			resetInversionCache(),
			{
				...situation,
				[inversedWith.dottedName]: undefined,
				[node.explanation.ruleToInverse]: {
					nodeValue: n,
					unit: parsedRules[node.explanation.ruleToInverse].unit
				}
			},
			parsedRules,
			inversedWith
		)
	// si fx renvoie null pour une valeur numérique standard, disons 2000, on peut
	// considérer que l'inversion est impossible du fait de variables manquantes
	// TODO fx peut être null pour certains x, et valide pour d'autres : on peut implémenter ici le court-circuit
	const randomAttempt = evaluateWithValue(2000)
	const nodeValue =
		randomAttempt.nodeValue === null
			? null
			: // cette fonction détermine l'inverse d'une fonction sans faire trop d'itérations
			  uniroot(
					x => {
						const candidateNode = evaluateWithValue(x)
						return (
							candidateNode.nodeValue -
							// TODO: convertNodeToUnit migth return null or false
							(convertNodeToUnit(candidateNode.unit, inversedWith)
								.nodeValue as number)
						)
					},
					node.explanation.negativeValuesAllowed ? -1000000 : 0,
					100000000,
					0.1,
					10
			  )
	if (nodeValue === undefined) {
		oldCache._meta.inversionFail = true
	} else {
		// For performance reason, we transfer the inversion cache
		Object.entries(inversionCache).forEach(([k, value]) => {
			oldCache[k] = value
		})
	}
	return {
		...node,
		nodeValue: nodeValue ?? null,
		explanation: {
			...node.explanation,
			inversionFail: nodeValue === undefined,
			inversedWith
		},
		missingVariables: randomAttempt.missingVariables
	}
}

export const mecanismInversion = dottedName => (recurse, k, v) => {
	if (!v.avec) {
		throw new Error(
			"Une formule d'inversion doit préciser _avec_ quoi on peut inverser la variable"
		)
	}
	return {
		evaluate: evaluateInversion,
		unit: v.unité && parseUnit(v.unité),
		explanation: {
			ruleToInverse: dottedName,
			inversionCandidates: v.avec.map(recurse),
			negativeValuesAllowed: v['valeurs négatives possibles'] === 'oui'
		},
		jsx: InversionNumérique,
		category: 'mecanism',
		name: 'inversion numérique',
		type: 'numeric'
	}
}
