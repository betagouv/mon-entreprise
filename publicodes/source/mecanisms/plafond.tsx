import React from 'react'
import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { InfixMecanism } from '../components/mecanisms/common'
import { typeWarning } from '../error'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'

function MecanismPlafond({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p
				style={
					explanation.plafond.isActive
						? { background: 'var(--lighterColor)', fontWeight: 'bold' }
						: {}
				}
			>
				<strong>Plafonné à : </strong>
				{makeJsx(explanation.plafond)}
			</p>
		</InfixMecanism>
	)
}
export type PlafondNode = {
	explanation: {
		plafond: ASTNode
		valeur: ASTNode
	}
	jsx: any
	nodeKind: 'plafond'
}
const evaluate: EvaluationFunction<'plafond'> = function (node) {
	const valeur = this.evaluateNode(node.explanation.valeur)

	let nodeValue = valeur.nodeValue
	let plafond = node.explanation.plafond
	if (nodeValue !== false) {
		const evaluatedPlafond = this.evaluateNode(plafond)
		if (valeur.unit) {
			try {
				plafond = convertNodeToUnit(valeur.unit, evaluatedPlafond)
			} catch (e) {
				typeWarning(
					this.cache._meta.contextRule,
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
		jsx: MecanismPlafond,
		explanation,
		nodeKind: 'plafond',
	} as PlafondNode
}

parsePlafond.nom = 'plafond'

registerEvaluationFunction('plafond', evaluate)
