import { EvaluationFunction } from '..'
import parse from '../parse'
import { bonus, mergeMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { ASTNode, EvaluatedNode } from '../AST/types'

export type ApplicableSiNode = {
	explanation: {
		condition: ASTNode
		valeur: ASTNode
	}
	nodeKind: 'applicable si'
}

const evaluate: EvaluationFunction<'applicable si'> = function (node) {
	const explanation = { ...node.explanation }
	const condition = this.evaluate(explanation.condition)
	let valeur = explanation.valeur
	if (condition.nodeValue !== false) {
		valeur = this.evaluate(valeur)
	}
	return {
		...node,
		nodeValue:
			condition.nodeValue == null || condition.nodeValue === false
				? condition.nodeValue
				: 'nodeValue' in valeur
				? (valeur as EvaluatedNode).nodeValue
				: null,
		explanation: { valeur, condition },
		missingVariables: mergeMissing(
			'missingVariables' in valeur ? valeur.missingVariables : {},
			bonus(condition.missingVariables)
		),
		...('unit' in valeur && { unit: valeur.unit }),
	}
}
parseApplicable.nom = 'applicable si' as const

export default function parseApplicable(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		condition: parse(v[parseApplicable.nom], context),
	}
	return {
		explanation,
		nodeKind: parseApplicable.nom,
	}
}

registerEvaluationFunction(parseApplicable.nom, evaluate)
