import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { typeWarning } from '../error'
import { mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'

export type PlancherNode = {
	explanation: {
		plancher: ASTNode
		valeur: ASTNode
	}
	nodeKind: 'plancher'
}

const evaluate: EvaluationFunction<'plancher'> = function (node) {
	const valeur = this.evaluate(node.explanation.valeur)
	let nodeValue = valeur.nodeValue
	let plancher = node.explanation.plancher
	if (nodeValue !== false) {
		const evaluatedPlancher = this.evaluate(plancher)
		if (valeur.unit) {
			try {
				plancher = convertNodeToUnit(valeur.unit, evaluatedPlancher)
			} catch (e) {
				typeWarning(
					this.cache._meta.contextRule,
					"L'unité du plancher n'est pas compatible avec celle de la valeur à encadrer",
					e
				)
			}
		}
	}
	if (
		typeof nodeValue === 'number' &&
		'nodeValue' in plancher &&
		typeof plancher.nodeValue === 'number' &&
		nodeValue < plancher.nodeValue
	) {
		nodeValue = plancher.nodeValue
		;(plancher as any).isActive = true
	}
	return {
		...node,
		nodeValue,
		...('unit' in valeur && { unit: valeur.unit }),
		explanation: { valeur, plancher },
		missingVariables: mergeAllMissing([valeur, plancher]),
	}
}

export default function Plancher(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		plancher: parse(v.plancher, context),
	}
	return {
		explanation,
		nodeKind: 'plancher',
	} as PlancherNode
}

Plancher.nom = 'plancher'

registerEvaluationFunction('plancher', evaluate)
