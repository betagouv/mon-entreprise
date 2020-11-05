import { evaluationFunction } from '..'
import Barème from '../components/mecanisms/Barème'
import { evaluationError } from '../error'
import {
	defaultNode,
	mergeAllMissing,
	registerEvaluationFunction
} from '../evaluation'
import {
	liftTemporal2,
	liftTemporalNode,
	mapTemporal,
	temporalAverage
} from '../temporal'
import { convertUnit, parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

// Barème en taux marginaux.
export default function parse(parse, v) {
	const explanation = {
		assiette: parse(v.assiette),
		multiplicateur: v.multiplicateur ? parse(v.multiplicateur) : defaultNode(1),
		tranches: parseTranches(parse, v.tranches)
	}
	return {
		explanation,
		jsx: Barème,
		category: 'mecanism',
		name: 'barème',
		nodeKind: 'barème',
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
				convertUnit(taux.unit, parseUnit(''), taux.nodeValue as number),
			missingVariables: mergeAllMissing([taux, tranche])
		}
	})
}
const evaluate: evaluationFunction = function(node) {
	const evaluateNode = this.evaluateNode.bind(this)
	const assiette = this.evaluateNode(node.explanation.assiette)
	const multiplicateur = this.evaluateNode(node.explanation.multiplicateur)
	const temporalTranchesPlafond = liftTemporal2(
		(assiette, multiplicateur) =>
			evaluatePlafondUntilActiveTranche(
				evaluateNode,
				{
					parsedTranches: node.explanation.tranches,
					assiette,
					multiplicateur
				},
				this.cache
			),
		liftTemporalNode(assiette),
		liftTemporalNode(multiplicateur)
	)
	const temporalTranches = liftTemporal2(
		(tranches, assiette) =>
			evaluateBarème(tranches, assiette, evaluateNode, this.cache),
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

registerEvaluationFunction('barème', evaluate)
