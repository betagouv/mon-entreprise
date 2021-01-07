import { last } from 'ramda'
import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { warning } from '../error'
import { mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'

export type PlafondNode = {
	explanation: {
		plafond: ASTNode
		valeur: ASTNode
	}
	nodeKind: 'plafond'
}

const evaluate: EvaluationFunction<'plafond'> = function (node) {
	const valeur = this.evaluate(node.explanation.valeur)

	let nodeValue = valeur.nodeValue
	let plafond = node.explanation.plafond
	if (nodeValue !== false) {
		const evaluatedPlafond = this.evaluate(plafond)
		if (valeur.unit) {
			try {
				plafond = convertNodeToUnit(valeur.unit, evaluatedPlafond)
			} catch (e) {
				warning(
					this.options.logger,
					this.cache._meta.ruleStack[0],
					"L'unité du plafond n'est pas compatible avec celle de la valeur à encadrer",
					e
				)
			}
		}
	}

	if (
		typeof nodeValue === 'number' &&
		'nodeValue' in plafond &&
		typeof plafond.nodeValue === 'number' &&
		nodeValue > plafond.nodeValue
	) {
		nodeValue = plafond.nodeValue
		;(plafond as any).isActive = true
	}
	return {
		...node,
		nodeValue,
		...('unit' in valeur && { unit: valeur.unit }),
		explanation: { valeur, plafond },
		missingVariables: mergeAllMissing([valeur, plafond]),
	}
}

export default function parsePlafond(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		plafond: parse(v.plafond, context),
	}
	return {
		explanation,
		nodeKind: 'plafond',
	} as PlafondNode
}

parsePlafond.nom = 'plafond'

registerEvaluationFunction('plafond', evaluate)
