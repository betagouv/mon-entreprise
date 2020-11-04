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

const evaluate: evaluationFunction = function(node) {
	const valeur = this.evaluateNode(node.explanation.valeur)

	let nodeValue = valeur.nodeValue
	let plafond = node.explanation.plafond
	if (nodeValue !== false) {
		plafond = this.evaluateNode(plafond)
		if (valeur.unit) {
			try {
				plafond = convertNodeToUnit(valeur.unit, plafond)
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
		typeof plafond.nodeValue === 'number' &&
		nodeValue > plafond.nodeValue
	) {
		nodeValue = plafond.nodeValue
		plafond.isActive = true
	}
	return {
		...node,
		nodeValue,
		unit: valeur.unit,
		explanation: { valeur, plafond },
		missingVariables: mergeAllMissing([valeur, plafond])
	}
}

export default function Plafond(recurse, v) {
	const explanation = {
		valeur: recurse(v.valeur),
		plafond: recurse(v.plafond)
	}
	return {
		jsx: MecanismPlafond,
		explanation,
		category: 'mecanism',
		name: 'plafond',
		nodeKind: 'plafond',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}

Plafond.nom = 'plafond'

registerEvaluationFunction('plafond', evaluate)
