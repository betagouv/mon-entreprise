import { defaultNode, E } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import Barème from 'Engine/mecanismViews/Barème'
import { val } from 'Engine/traverse-common-functions'
import { inferUnit, parseUnit } from 'Engine/units'
import { evolve, has, pluck, sum } from 'ramda'

export let desugarScale = recurse => tranches =>
	tranches
		.map(t =>
			has('en-dessous de')(t)
				? { ...t, de: 0, à: t['en-dessous de'] }
				: has('au-dessus de')(t)
				? { ...t, de: t['au-dessus de'], à: Infinity }
				: t
		)
		.map(evolve({ taux: recurse }))

// This function was also used for marginal barèmes, but now only for linear ones
export let trancheValue = (assiette, multiplicateur) => ({
	de: min,
	à: max,
	taux,
	montant
}) =>
	Math.round(val(assiette)) >= min * val(multiplicateur) &&
	(!max || Math.round(val(assiette)) <= max * val(multiplicateur))
		? taux != null
			? val(assiette) * val(taux)
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
		let e = E(cache, situationGate, parsedRules)

		let { assiette, multiplicateur } = node.explanation,
			tranches = node.explanation.tranches.map(tranche => {
				let { de: min, à: max, taux } = tranche
				let value =
					e.val(assiette) < min * e.val(multiplicateur)
						? 0
						: (Math.min(e.val(assiette), max * e.val(multiplicateur)) -
								min * e.val(multiplicateur)) *
						  e.val(taux)

				return { ...tranche, value }
			}),
			nodeValue = sum(pluck('value', tranches))

		return {
			...node,
			nodeValue,
			explanation: {
				...explanation,
				tranches
			},
			missingVariables: e.missingVariables(),
			lazyEval: e.valNode
		}
	}

	return {
		explanation,
		evaluate,
		jsx: Barème('marginal'),
		category: 'mecanism',
		name: 'barème',
		barème: 'marginal',
		unit: inferUnit('*', [explanation.assiette.unit, parseUnit('%')])
	}
}
