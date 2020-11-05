import React from 'react'
import { evaluationFunction } from '..'
import { InfixMecanism } from '../components/mecanisms/common'
import { typeWarning } from '../error'
import {
	makeJsx,
	mergeAllMissing,
	registerEvaluationFunction
} from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'

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

const evaluate: evaluationFunction = function(node) {
	const valeur = this.evaluateNode(node.explanation.valeur)
	let nodeValue = valeur.nodeValue
	let plancher = node.explanation.plancher
	if (nodeValue !== false) {
		plancher = this.evaluateNode(plancher)
		if (valeur.unit) {
			try {
				plancher = convertNodeToUnit(valeur.unit, plancher)
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
		typeof plancher.nodeValue === 'number' &&
		nodeValue < plancher.nodeValue
	) {
		nodeValue = plancher.nodeValue
		plancher.isActive = true
	}
	return {
		...node,
		nodeValue,
		explanation: { valeur, plancher },
		missingVariables: mergeAllMissing([valeur, plancher]),
		unit: valeur.unit
	}
}

export default function Plancher(recurse, v) {
	const explanation = {
		valeur: recurse(v.valeur),
		plancher: recurse(v.plancher)
	}
	return {
		evaluate,
		jsx: MecanismPlancher,
		explanation,
		category: 'mecanism',
		name: 'plancher',
		nodeKind: 'plancher',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}

Plancher.nom = 'plancher'

registerEvaluationFunction('plancher', evaluate)
