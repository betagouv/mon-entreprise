import React from 'react'
import { InfixMecanism } from '../components/mecanisms/common'
import {
	bonus,
	evaluateNode,
	makeJsx,
	mergeMissing,
	registerEvaluationFunction
} from '../evaluation'

function MecanismNonApplicable({ explanation }) {
	return (
		<InfixMecanism prefixed value={explanation.valeur}>
			<p>
				<strong>Non applicable si : </strong>
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
	if (condition.nodeValue !== true) {
		valeur = evaluateAttribute(valeur)
	}
	return {
		...node,
		nodeValue:
			condition.nodeValue == null
				? condition.nodeValue
				: condition.nodeValue === true
				? false
				: valeur.nodeValue,
		explanation: { valeur, condition },
		missingVariables: mergeMissing(
			valeur.missingVariables,
			bonus(condition.missingVariables)
		),
		unit: valeur.unit
	}
}

export default function NonApplicable(recurse, v) {
	const explanation = {
		valeur: recurse(v.valeur),
		condition: recurse(v['non applicable si'])
	}
	return {
		jsx: MecanismNonApplicable,
		explanation,
		category: 'mecanism',
		name: 'non applicable',
		nodeKind: 'non applicable',
		unit: explanation.valeur.unit
	}
}

NonApplicable.nom = 'non applicable si'

registerEvaluationFunction('non applicable', evaluate)
