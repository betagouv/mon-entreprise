import React from 'react'
import { evaluationFunction } from '..'
import parse from '../parse'
import { InfixMecanism, Mecanism } from '../components/mecanisms/common'
import { bonus, makeJsx, mergeMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { ASTNode, EvaluatedNode } from '../AST/types'

export type ApplicableSiNode = {
	explanation: {
		condition: ASTNode
		valeur: ASTNode
	}
	jsx: any
	nodeKind: 'applicable si'
}

function MecanismApplicable({ explanation }) {
	return (
		<InfixMecanism prefixed value={explanation.valeur}>
			<Mecanism name="applicable si" value={explanation.condition.nodeValue}>
				{makeJsx(explanation.condition)}
			</Mecanism>
			<br />
		</InfixMecanism>
	)
}

const evaluate: evaluationFunction<'applicable si'> = function(node) {
	const explanation = { ...node.explanation }
	const condition = this.evaluateNode(explanation.condition)
	let valeur = explanation.valeur
	if (condition.nodeValue !== false) {
		valeur = this.evaluateNode(valeur)
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
		...('unit' in valeur && { unit: valeur.unit })
	}
}
parseApplicable.nom = 'applicable si' as const

export default function parseApplicable(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		condition: parse(v[parseApplicable.nom], context)
	}
	return {
		jsx: MecanismApplicable,
		explanation,
		nodeKind: parseApplicable.nom
	}
}

registerEvaluationFunction(parseApplicable.nom, evaluate)
