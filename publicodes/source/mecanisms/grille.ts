import { lensPath, over } from 'ramda'
import { evaluationFunction } from '..'
import grille from '../components/mecanisms/Grille'
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
import { parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches
} from './trancheUtils'

export default function parse(parse, v) {
	const defaultUnit = v['unité'] && parseUnit(v['unité'])
	const explanation = {
		assiette: parse(v.assiette),
		multiplicateur: v.multiplicateur ? parse(v.multiplicateur) : defaultNode(1),
		tranches: parseTranches(parse, v.tranches).map(
			over(lensPath(['montant', 'unit']), unit => unit ?? defaultUnit)
		)
	}
	return {
		explanation,
		jsx: grille,
		category: 'mecanism',
		name: 'grille',
		nodeKind: 'grille',
		type: 'numeric',
		unit: explanation.tranches[0].montant.unit
	}
}
const evaluateGrille = (tranches, evaluate) =>
	tranches.map(tranche => {
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

const evaluate: evaluationFunction = function(node: any) {
	const evaluate = this.evaluateNode.bind(this)
	const assiette = this.evaluateNode(node.explanation.assiette)
	const multiplicateur = this.evaluateNode(node.explanation.multiplicateur)
	const temporalTranchesPlafond = liftTemporal2(
		(assiette, multiplicateur) =>
			evaluatePlafondUntilActiveTranche(
				evaluate,
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
	const temporalTranches = mapTemporal(
		tranches => evaluateGrille(tranches, evaluate),
		temporalTranchesPlafond
	)

	const activeTranches = mapTemporal(tranches => {
		const activeTranche = tranches.find(tranche => tranche.isActive)
		if (activeTranche) {
			return [activeTranche]
		}
		const lastTranche = tranches[tranches.length - 1]
		if (lastTranche.isAfterActive === false) {
			return [{ nodeValue: false }]
		}
		return tranches.filter(tranche => tranche.isActive === null)
	}, temporalTranches)
	const temporalValue = mapTemporal(
		tranches => (tranches[0].isActive === null ? null : tranches[0].nodeValue),
		activeTranches
	)

	return {
		...node,
		nodeValue: temporalAverage(temporalValue),
		...(temporalValue.length > 1
			? {
					temporalValue
			  }
			: { missingVariables: mergeAllMissing(activeTranches[0].value) }),
		explanation: {
			assiette,
			multiplicateur,
			...(temporalTranches.length > 1
				? { temporalTranches }
				: { tranches: temporalTranches[0].value })
		},
		unit: activeTranches[0].value[0]?.unit ?? node.unit
	}
}

registerEvaluationFunction('grille', evaluate)
