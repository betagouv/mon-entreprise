import React from 'react'
import { InfixMecanism } from '../components/mecanisms/common'
import { bonus, evaluateNode, makeJsx, mergeMissing } from '../evaluation'

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

const evaluate = (cache, situation, parsedRules, node) => {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)
	const condition = evaluateAttribute(node.explanation.condition)
	let valeur = node.explanation.valeur
	if (condition.nodeValue !== false) {
		valeur = evaluateAttribute(valeur)
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
		evaluate,
		jsx: MecanismApplicable,
		explanation,
		category: 'mecanism',
		name: Applicable.name,
		unit: explanation.valeur.unit
	}
}

Applicable.nom = 'applicable si'
