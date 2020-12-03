import React from 'react'
import { evaluationFunction } from '..'
import { InfixMecanism } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { typeWarning } from '../error'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'
import { EvaluationDecoration } from '../AST/types'

function MecanismPlancher({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p
				style={
					explanation.plancher.isActive
						? { background: 'var(--lighterColor)', fontWeight: 'bold' }
						: {}
				}
			>
				<strong>Minimum : </strong>
				{makeJsx(explanation.plancher)}
			</p>
		</InfixMecanism>
	)
}
export type PlancherNode = {
	explanation: {
		plancher: ASTNode
		valeur: ASTNode
	}
	jsx: any
	nodeKind: 'plancher'
}
const evaluate: evaluationFunction<'plancher'> = function(node) {
	const valeur = this.evaluateNode(node.explanation.valeur)
	let nodeValue = valeur.nodeValue
	let plancher = node.explanation.plancher
	if (nodeValue !== false) {
		plancher = this.evaluateNode(plancher)
		if (valeur.unit) {
			try {
				plancher = convertNodeToUnit(
					valeur.unit,
					plancher as ASTNode & EvaluationDecoration
				)
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
		missingVariables: mergeAllMissing([valeur, plancher])
	}
}

export default function Plancher(v, context) {
	const explanation = {
		valeur: parse(v.valeur, context),
		plancher: parse(v.plancher, context)
	}
	return {
		jsx: MecanismPlancher,
		explanation,
		nodeKind: 'plancher'
	} as PlancherNode
}

Plancher.nom = 'plancher'

registerEvaluationFunction('plancher', evaluate)
