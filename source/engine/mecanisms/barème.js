import { defaultNode, evaluateNode, mergeAllMissing } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import Barème from 'Engine/mecanismViews/Barème'
import { evolve, has } from 'ramda'
import { typeWarning } from '../error'
import { convertNodeToUnit } from '../nodeUnits'
import { parseUnit } from '../units'

export let desugarScale = recurse => tranches =>
	tranches
		.map(t =>
			has('en-dessous de')(t)
				? { ...t, de: 0, à: t['en-dessous de'] }
				: has('au-dessus de')(t)
				? { ...t, de: t['au-dessus de'], à: Infinity }
				: t
		)
		.map(evolve({ taux: recurse, montant: recurse }))

// This function was also used for marginal barèmes, but now only for linear ones
export let trancheValue = (assiette, multiplicateur) => ({
	de: min,
	à: max,
	taux,
	montant
}) =>
	Math.round(assiette.nodeValue) >= min * multiplicateur.nodeValue &&
	(!max || Math.round(assiette.nodeValue) <= max * multiplicateur.nodeValue)
		? taux != null
			? assiette.nodeValue * taux.nodeValue
			: montant
		: 0

export default (recurse, k, v) => {
	// Barème en taux marginaux.

	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return variations(recurse, k, v, true)
	}

	let { assiette, multiplicateur } = v,
		tranches = desugarScale(recurse)(v['tranches'])

	let explanation = {
		assiette: recurse(assiette),
		multiplicateur: multiplicateur ? recurse(multiplicateur) : defaultNode(1),
		tranches
	}

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let { assiette, multiplicateur } = node.explanation
		assiette = evaluateNode(cache, situationGate, parsedRules, assiette)
		multiplicateur = evaluateNode(
			cache,
			situationGate,
			parsedRules,
			multiplicateur
		)
		try {
			multiplicateur = convertNodeToUnit(assiette.unit, multiplicateur)
		} catch (e) {
			typeWarning(
				cache._meta.contextRule,
				`L'unité du multiplicateur du barème doit être compatible avec celle de son assiette`,
				e
			)
		}
		const tranches = node.explanation.tranches.map(tranche => {
			let { de: min, à: max, taux } = tranche
			if (
				[assiette, multiplicateur].every(
					({ nodeValue }) => nodeValue != null
				) &&
				assiette.nodeValue < min * multiplicateur.nodeValue
			) {
				return { ...tranche, nodeValue: 0 }
			}
			taux = convertNodeToUnit(
				parseUnit(''),
				evaluateNode(cache, situationGate, parsedRules, taux)
			)
			if (
				[assiette, multiplicateur, taux].some(
					({ nodeValue }) => nodeValue == null
				)
			) {
				return {
					...tranche,
					nodeValue: null,
					missingVariables: taux.missingVariables
				}
			}
			return {
				...tranche,
				nodeValue:
					(Math.min(assiette.nodeValue, max * multiplicateur.nodeValue) -
						min * multiplicateur.nodeValue) *
					taux.nodeValue
			}
		})

		const nodeValue = tranches.reduce(
			(value, { nodeValue }) => (nodeValue == null ? null : value + nodeValue),
			0
		)
		const missingVariables = mergeAllMissing([
			assiette,
			multiplicateur,
			...tranches
		])
		return {
			...node,
			nodeValue,
			explanation: {
				...explanation,
				tranches
			},
			missingVariables,
			unit: assiette.unit,
			lazyEval: node => evaluateNode(cache, situationGate, parsedRules, node)
		}
	}

	return {
		explanation,
		evaluate,
		jsx: Barème('marginal'),
		category: 'mecanism',
		name: 'barème',
		barème: 'marginal',
		unit: explanation.assiette.unit
	}
}
