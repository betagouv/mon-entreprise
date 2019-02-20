import { val } from 'Engine/traverse-common-functions'
import { decompose } from 'Engine/mecanisms/utils'
import { mecanismVariations } from 'Engine/mecanisms'
import { has, evolve, sum } from 'ramda'
import {
	defaultNode,
	evaluateNode,
	mergeMissing,
	rewriteNode
} from 'Engine/evaluation'

import Barème from 'Engine/mecanismViews/Barème'

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

export let trancheValue = barèmeType => (assiette, multiplicateur) =>
	barèmeType === 'marginal'
		? ({ de: min, à: max, taux }) =>
				val(assiette) < min * val(multiplicateur)
					? 0
					: (Math.min(val(assiette), max * val(multiplicateur)) -
							min * val(multiplicateur)) *
					  val(taux)
		: ({ de: min, à: max, taux, montant }) =>
				Math.round(val(assiette)) >= min &&
				(!max || Math.round(val(assiette)) <= max)
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
		return mecanismVariations(recurse, k, v, true)
	}

	let tranches = desugarScale(recurse)(v['tranches'])

	let explanation = {
		assiette: recurse(v['assiette']),
		multiplicateur:
			v['multiplicateur'] != null
				? recurse(v['multiplicateur'])
				: defaultNode(1),
		tranches
	}

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let mv = {}

		let v = element => {
				let evaluated = evaluateNode(cache, situationGate, parsedRules, element)
				// automatically add missing variables when a variable is evaluated and thus needed in this mecanism's evaluation
				mv = mergeMissing(mv, evaluated.missingVariables)

				return evaluated.nodeValue
			},
			{ assiette, multiplicateur } = node.explanation,
			trancheValues = node.explanation.tranches.map(
				({ de: min, à: max, taux }) =>
					v(assiette) < min * v(multiplicateur)
						? 0
						: (Math.min(v(assiette), max * v(multiplicateur)) -
								min * v(multiplicateur)) *
						  v(taux)
			),
			nodeValue = sum(trancheValues)

		return rewriteNode(node, nodeValue, explanation, mv)
	}

	return {
		explanation,
		evaluate,
		jsx: () => null,
		//	jsx: Barème('marginal'),
		category: 'mecanism',
		name: 'barème',
		barème: 'marginal'
	}
}
