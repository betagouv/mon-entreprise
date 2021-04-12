import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { defaultNode, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import {
	liftTemporal2,
	liftTemporalNode,
	mapTemporal,
	temporalAverage,
} from '../temporal'
import { convertUnit, parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches,
	TrancheNodes,
} from './trancheUtils'

// Barème en taux marginaux.
export type BarèmeNode = {
	explanation: {
		tranches: TrancheNodes
		multiplicateur: ASTNode
		assiette: ASTNode
	}
	nodeKind: 'barème'
}
export default function parseBarème(v, context): BarèmeNode {
	const explanation = {
		assiette: parse(v.assiette, context),
		multiplicateur: v.multiplicateur
			? parse(v.multiplicateur, context)
			: defaultNode(1),
		tranches: parseTranches(v.tranches, context),
	}
	return {
		explanation,
		nodeKind: 'barème',
	}
}

function evaluateBarème(tranches, assiette, evaluate) {
	return tranches.map((tranche) => {
		if (tranche.isAfterActive) {
			return { ...tranche, nodeValue: 0 }
		}
		const taux = evaluate(tranche.taux)
		const missingVariables = mergeAllMissing([taux, tranche])

		if (
			[
				assiette.nodeValue,
				taux.nodeValue,
				tranche.plafondValue,
				tranche.plancherValue,
			].some((value) => value === null)
		) {
			return {
				...tranche,
				taux,
				nodeValue: null,
				missingVariables,
			}
		}
		return {
			...tranche,
			taux,
			...('unit' in assiette && { unit: assiette.unit }),
			nodeValue:
				(Math.min(assiette.nodeValue, tranche.plafondValue) -
					tranche.plancherValue) *
				convertUnit(taux.unit, parseUnit(''), taux.nodeValue as number),
			missingVariables,
		}
	})
}
const evaluate: EvaluationFunction<'barème'> = function (node) {
	const evaluate = this.evaluate.bind(this)
	const assiette = this.evaluate(node.explanation.assiette)
	const multiplicateur = this.evaluate(node.explanation.multiplicateur)
	const temporalTranchesPlafond = liftTemporal2(
		(assiette, multiplicateur) =>
			evaluatePlafondUntilActiveTranche.call(this, {
				parsedTranches: node.explanation.tranches,
				assiette,
				multiplicateur,
			}),
		liftTemporalNode(assiette as any),
		liftTemporalNode(multiplicateur as any)
	)
	const temporalTranches = liftTemporal2(
		(tranches, assiette) => evaluateBarème(tranches, assiette, evaluate),
		temporalTranchesPlafond,
		liftTemporalNode(assiette as any)
	)
	const temporalValue = mapTemporal(
		(tranches) =>
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
					temporalValue,
			  }
			: { missingVariables: mergeAllMissing(temporalTranches[0].value) }),
		explanation: {
			assiette,
			multiplicateur,
			...(temporalTranches.length > 1
				? { temporalTranches }
				: { tranches: temporalTranches[0].value }),
		},
		unit: assiette.unit,
	} as any
}

registerEvaluationFunction('barème', evaluate)
