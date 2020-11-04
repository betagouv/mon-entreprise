import { evaluationFunction } from '..'
import InversionNumérique from '../components/mecanisms/InversionNumérique'
import { registerEvaluationFunction } from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import uniroot from '../uniroot'
import { parseUnit } from '../units'

export const evaluateInversion: evaluationFunction = function(node) {
	// TODO : take applicability into account here
	let inversedWith = node.explanation.inversionCandidates.find(
		n => this.parsedSituation[n.dottedName] != undefined
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
	inversedWith = this.evaluateNode(inversedWith)
	const originalCache = { ...this.cache }
	const originalSituation = { ...this.parsedSituation }
	const evaluateWithValue = (n: number) => {
		this.cache = {
			_meta: { ...originalCache._meta }
		}
		this.parsedSituation = {
			...originalSituation,
			[inversedWith.dottedName]: undefined,
			[node.explanation.ruleToInverse]: {
				nodeValue: n,
				unit: this.parsedRules[node.explanation.ruleToInverse].unit
			}
		}
		return this.evaluateNode(inversedWith)
	}

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
					10,
					1
			  )
	if (nodeValue === undefined) {
		originalCache._meta.inversionFail = true
	} else {
		// For performance reason, we transfer the inversion cache
		Object.entries(this.cache).forEach(([k, value]) => {
			originalCache[k] = value
		})
	}
	this.cache = originalCache
	this.parsedSituation = originalSituation
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

export const mecanismInversion = dottedName => (recurse, v) => {
	if (!v.avec) {
		throw new Error(
			"Une formule d'inversion doit préciser _avec_ quoi on peut inverser la variable"
		)
	}
	return {
		unit: v.unité && parseUnit(v.unité),
		explanation: {
			ruleToInverse: dottedName,
			inversionCandidates: v.avec.map(recurse),
			negativeValuesAllowed: v['valeurs négatives possibles'] === 'oui'
		},
		jsx: InversionNumérique,
		category: 'mecanism',
		name: 'inversion numérique',
		nodeKind: 'inversion',
		type: 'numeric'
	}
}

registerEvaluationFunction('inversion', evaluateInversion)
