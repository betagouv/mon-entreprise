import { EvaluationFunction } from '..'
import { defaultNode, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import {
	liftTemporal2,
	liftTemporalNode,
	mapTemporal,
	temporalAverage,
} from '../temporal'

import {
	evaluatePlafondUntilActiveTranche,
	parseTranches,
	TrancheNodes,
} from './trancheUtils'
import parse from '../parse'
import { ASTNode } from '../AST/types'

export type GrilleNode = {
	explanation: {
		assiette: ASTNode
		multiplicateur: ASTNode
		tranches: TrancheNodes
	}
	nodeKind: 'grille'
}

export default function parseGrille(v, context): GrilleNode {
	const explanation = {
		assiette: parse(v.assiette, context),
		multiplicateur: v.multiplicateur
			? parse(v.multiplicateur, context)
			: defaultNode(1),
		tranches: parseTranches(v.tranches, context),
	}
	return {
		explanation,
		nodeKind: 'grille',
	}
}
const evaluateGrille = (tranches, evaluate) =>
	tranches.map((tranche) => {
		if (tranche.isActive === false) {
			return tranche
		}
		const montant = evaluate(tranche.montant)
		return {
			...tranche,
			montant,
			nodeValue: montant.nodeValue,
			unit: montant.unit,
			missingVariables: mergeAllMissing([montant, tranche]),
		}
	})

const evaluate: EvaluationFunction<'grille'> = function (node) {
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
	const temporalTranches = mapTemporal(
		(tranches) => evaluateGrille(tranches, evaluate),
		temporalTranchesPlafond
	)

	const activeTranches = mapTemporal((tranches) => {
		const activeTranche = tranches.find((tranche) => tranche.isActive)
		if (activeTranche) {
			return [activeTranche]
		}
		const lastTranche = tranches[tranches.length - 1]
		if (lastTranche.isAfterActive === false) {
			return [{ nodeValue: false }]
		}
		return tranches.filter((tranche) => tranche.isActive === null)
	}, temporalTranches)
	const temporalValue = mapTemporal(
		(tranches) =>
			tranches[0].isActive === null ? null : tranches[0].nodeValue,
		activeTranches
	)

	return {
		...node,
		nodeValue: temporalAverage(temporalValue),
		...(temporalValue.length > 1
			? {
					temporalValue,
			  }
			: { missingVariables: mergeAllMissing(activeTranches[0].value) }),
		explanation: {
			...node.explanation,
			assiette,
			multiplicateur,
			...(temporalTranches.length > 1
				? { temporalTranches }
				: { tranches: temporalTranches[0].value }),
		},
		unit: activeTranches[0].value[0]?.unit ?? undefined,
	} as any
}

registerEvaluationFunction('grille', evaluate)
