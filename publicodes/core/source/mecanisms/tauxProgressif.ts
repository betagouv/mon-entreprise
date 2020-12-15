import { EvaluationFunction } from '..'
import { defaultNode, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

import { convertNodeToUnit } from '../nodeUnits'
import { parseUnit } from '../units'
import {
	evaluatePlafondUntilActiveTranche,
	parseTranches,
	TrancheNodes,
} from './trancheUtils'
import { ASTNode } from '../AST/types'
export type TauxProgressifNode = {
	explanation: {
		tranches: TrancheNodes
		multiplicateur: ASTNode
		assiette: ASTNode
	}
	nodeKind: 'taux progressif'
}
export default function parseTauxProgressif(v, context): TauxProgressifNode {
	const explanation = {
		assiette: parse(v.assiette, context),
		multiplicateur: v.multiplicateur
			? parse(v.multiplicateur, context)
			: defaultNode(1),
		tranches: parseTranches(v.tranches, context),
	} as TauxProgressifNode['explanation']
	return {
		explanation,
		nodeKind: 'taux progressif',
	}
}

const evaluate: EvaluationFunction<'taux progressif'> = function (node) {
	const evaluate = this.evaluateNode.bind(this)
	const assiette = this.evaluateNode(node.explanation.assiette)
	const multiplicateur = this.evaluateNode(node.explanation.multiplicateur)
	const tranches = evaluatePlafondUntilActiveTranche(
		evaluate,
		{
			parsedTranches: node.explanation.tranches,
			assiette,
			multiplicateur,
		},
		this.cache
	)

	const evaluatedNode = {
		...node,
		explanation: {
			tranches,
			assiette,
			multiplicateur,
		},
		unit: parseUnit('%'),
	}

	const lastTranche = tranches[tranches.length - 1]
	if (
		tranches.every(({ isActive }) => isActive === false) ||
		(lastTranche.isActive && lastTranche.plafond.nodeValue === Infinity)
	) {
		const taux = convertNodeToUnit(parseUnit('%'), evaluate(lastTranche.taux))
		const { nodeValue, missingVariables } = taux
		lastTranche.taux = taux
		lastTranche.nodeValue = nodeValue
		lastTranche.missingVariables = missingVariables
		return {
			...evaluatedNode,
			nodeValue,
			missingVariables,
		}
	}

	if (
		tranches.every(({ isActive }) => isActive !== true) ||
		typeof assiette.nodeValue !== 'number'
	) {
		return {
			...evaluatedNode,
			nodeValue: null,
			missingVariables: mergeAllMissing(tranches),
		}
	}

	const activeTrancheIndex = tranches.findIndex(
		({ isActive }) => isActive === true
	)
	const activeTranche = tranches[activeTrancheIndex]
	activeTranche.taux = convertNodeToUnit(
		parseUnit('%'),
		evaluate(activeTranche.taux)
	)

	const previousTranche = tranches[activeTrancheIndex - 1]
	if (previousTranche) {
		previousTranche.taux = convertNodeToUnit(
			parseUnit('%'),
			evaluate(previousTranche.taux)
		)
		previousTranche.isActive = true
	}
	const previousTaux = previousTranche
		? previousTranche.taux
		: activeTranche.taux
	const calculationValues = [previousTaux, activeTranche.taux, activeTranche]
	if (calculationValues.some((n) => n.nodeValue === null)) {
		activeTranche.nodeValue = null
		activeTranche.missingVariables = mergeAllMissing(calculationValues)
		return {
			...evaluatedNode,
			nodeValue: null,
			missingVariables: activeTranche.missingVariables,
		}
	}

	const lowerTaux = previousTaux.nodeValue
	const upperTaux = activeTranche.taux.nodeValue
	const plancher = activeTranche.plancherValue
	const plafond = activeTranche.plafondValue
	const coeff = (upperTaux - lowerTaux) / (plafond - plancher)
	const nodeValue = lowerTaux + (assiette.nodeValue - plancher) * coeff
	activeTranche.nodeValue = nodeValue
	return {
		...evaluatedNode,
		nodeValue,
		missingVariables: {},
	}
}

registerEvaluationFunction('taux progressif', evaluate)
