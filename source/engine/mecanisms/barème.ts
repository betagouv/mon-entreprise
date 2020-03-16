import { evaluationError } from 'Engine/error'
import { defaultNode, evaluateNode, mergeAllMissing } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import Barème from 'Engine/mecanismViews/Barème'
import { liftTemporalNode, mapTemporal, temporalAverage } from 'Engine/period'
import { liftTemporal2 } from 'Engine/temporal'
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

function evaluateBarème(tranches, assiette, evaluate, cache) {
	return tranches.map(tranche => {
		if (tranche.isAfterActive) {
			return { ...tranche, nodeValue: 0 }
		}
		const taux = evaluate(tranche.taux)
		if (taux.temporalValue) {
			evaluationError(
				cache._meta.contextRule,
				"Le taux d'une tranche ne peut pas être une valeur temporelle"
			)
		}

		if (
			[
				assiette.nodeValue,
				taux.nodeValue,
				tranche.plafondValue,
				tranche.plancherValue
			].some(value => value === null)
		) {
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
	const temporalTranchesPlafond = liftTemporal2(
		(assiette, multiplicateur) =>
			evaluatePlafondUntilActiveTranche(
				evaluate,
				{
					parsedTranches: node.explanation.tranches,
					assiette,
					multiplicateur
				},
				cache
			),
		liftTemporalNode(assiette),
		liftTemporalNode(multiplicateur)
	)
	const temporalTranches = liftTemporal2(
		(tranches, assiette) => evaluateBarème(tranches, assiette, evaluate, cache),
		temporalTranchesPlafond,
		liftTemporalNode(assiette)
	)
	const temporalValue = mapTemporal(
		tranches =>
			tranches.reduce(
				(value, { nodeValue }) =>
					nodeValue == null ? null : value + nodeValue,
				0
			),
		temporalTranches
	)

	return {
		...node,
		nodeValue: temporalAverage(temporalValue),
		...(temporalValue.length > 1
			? {
					temporalValue
			  }
			: { missingVariables: mergeAllMissing(temporalTranches[0].value) }),
		explanation: {
			assiette,
			multiplicateur,
			...(temporalTranches.length > 1
				? { temporalTranches }
				: { tranches: temporalTranches[0].value })
		},
		unit: assiette.unit
	}
}
