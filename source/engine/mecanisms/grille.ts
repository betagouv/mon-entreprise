import { defaultNode, evaluateNode, mergeAllMissing } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import grille from 'Engine/mecanismViews/Grille'
import { parseUnit } from 'Engine/units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

export default function parse(parse, k, v) {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(parse, k, v)
	}
	if (v.variations) {
		return variations(parse, k, v, true)
	}

	let explanation = {
		assiette: parse(v.assiette),
		multiplicateur: v.multiplicateur ? parse(v.multiplicateur) : defaultNode(1),
		tranches: parseTranches(parse, v.tranches)
	}
	return {
		evaluate,
		explanation,
		jsx: grille,
		category: 'mecanism',
		name: 'grille',
		type: 'numeric',
		unit:
			(v['unité'] && parseUnit(v['unité'])) ||
			explanation.tranches[0].montant.unit
	}
}

const evaluate = (
	cache,
	situationGate,
	parsedRules,
	node: ReturnType<typeof parse>
) => {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)
	const assiette = evaluate(node.explanation.assiette)
	const multiplicateur = evaluate(node.explanation.multiplicateur)
	const tranches = evaluatePlafondUntilActiveTranche(
		evaluate,
		{
			parsedTranches: node.explanation.tranches,
			assiette,
			multiplicateur
		},
		cache
	).map(tranche => {
		if (tranche.isActive === false) {
			return tranche
		}
		const montant = evaluate(tranche.montant)
		return {
			...tranche,
			montant,
			nodeValue: montant.nodeValue,
			unit: montant.unit,
			missingVariables: mergeAllMissing([montant, tranche])
		}
	})

	const activeTranches = tranches.filter(({ isActive }) => isActive != false)
	const missingVariables = mergeAllMissing(activeTranches)
	const nodeValue = activeTranches.length ? activeTranches[0].nodeValue : 0

	return {
		tranches,
		assiette,
		multiplicateur,
		missingVariables,
		nodeValue,
		...(nodeValue && { unit: activeTranches[0].unit })
	}
}
