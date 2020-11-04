import React from 'react'
import { evaluationFunction } from '..'
import { InfixMecanism } from '../components/mecanisms/common'
import {
	bonus,
	makeJsx,
	mergeMissing,
	registerEvaluationFunction
} from '../evaluation'

function MecanismApplicable({ explanation }) {
	return (
		<InfixMecanism prefixed value={explanation.valeur}>
			<p>
				<strong>Applicable si : </strong>
				{makeJsx(explanation.applicable)}
			</p>
		</InfixMecanism>
	)
}

const evaluate: evaluationFunction = function(node) {
	const condition = this.evaluateNode(node.explanation.condition)
	let valeur = node.explanation.valeur
	if (condition.nodeValue !== false) {
		valeur = this.evaluateNode(valeur)
	}
	return {
		...node,
		nodeValue:
			condition.nodeValue == null || condition.nodeValue === false
				? condition.nodeValue
				: valeur.nodeValue,
		explanation: { valeur, condition },
		missingVariables: mergeMissing(
			valeur.missingVariables,
			bonus(condition.missingVariables)
		),
		unit: valeur.unit
	}
}

export default function Applicable(recurse, v) {
	const explanation = {
		valeur: recurse(v.valeur),
		condition: recurse(v['applicable si'])
	}
	return {
		// evaluate,
		jsx: MecanismApplicable,
		explanation,
		category: 'mecanism',
		name: Applicable.nom,
		nodeKind: Applicable.nom,
		unit: explanation.valeur.unit
	}
}

Applicable.nom = 'applicable si'

registerEvaluationFunction(Applicable.nom, evaluate)
