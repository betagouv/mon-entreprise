import { defaultNode, evaluateNode, mergeAllMissing } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import Barème from 'Engine/mecanismViews/Barème'
import { convertUnit, parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

export default function parse(parse, k, v) {
	// Barème en taux marginaux.

	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(parse, k, v)
	}
	if (v.variations) {
		return variations(parse, k, v, true)
	}
	const explanation = {
		assiette: parse(v.assiette),
		multiplicateur: v.multiplicateur ? parse(v.multiplicateur) : defaultNode(1),
		tranches: parseTranches(parse, v.tranches)
	}
	return {
		explanation,
		evaluate,
		jsx: Barème,
		category: 'mecanism',
		name: 'barème',
		type: 'numeric',
		unit: explanation.assiette.unit
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
		if (tranche.isAfterActive) {
			return { ...tranche, nodeValue: 0 }
		}
		const taux = evaluate(tranche.taux)
		if ([taux.nodeValue, tranche.nodeValue].some(value => value === null)) {
			return {
				...tranche,
				taux,
				nodeValue: null,
				missingVariables: mergeAllMissing([taux, tranche])
			}
		}
		return {
			...tranche,
			taux,
			unit: assiette.unit,
			nodeValue:
				(Math.min(assiette.nodeValue, tranche.plafondValue) -
					tranche.plancherValue) *
				convertUnit(taux.unit, parseUnit(''), taux.nodeValue)
		}
	})
	return {
		...node,
		nodeValue: tranches.reduce(
			(value, { nodeValue }) => (nodeValue == null ? null : value + nodeValue),
			0
		),
		missingVariables: mergeAllMissing(tranches),
		explanation: {
			assiette,
			multiplicateur,
			tranches
		},
		unit: assiette.unit
	}
}
