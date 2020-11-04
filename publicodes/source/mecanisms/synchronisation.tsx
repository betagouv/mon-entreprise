import { path } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { RuleLinkWithContext } from '../components/RuleLink'
import { registerEvaluationFunction } from '../evaluation'

const evaluate: evaluationFunction = function(node: any) {
	const APIExplanation = this.evaluateNode(node.explanation.API)
	const valuePath = node.explanation.chemin.split(' . ')
	const nodeValue =
		APIExplanation.nodeValue == null
			? null
			: path(valuePath, APIExplanation.nodeValue)
	// If the API gave a non null value, then some of its props may be null (the
	// API can be composed of multiple API, some failing). Then this prop will be
	// set to the default value defined in the API's rule
	const safeNodeValue =
		nodeValue == null && APIExplanation.nodeValue != null
			? path(valuePath, APIExplanation.explanation.defaultValue)
			: nodeValue
	const missingVariables = {
		...APIExplanation.missingVariables,
		...(APIExplanation.nodeValue === null
			? { [APIExplanation.dottedName]: 1 }
			: {})
	}

	const explanation = { ...node.explanation, API: APIExplanation }
	return { ...node, nodeValue: safeNodeValue, explanation, missingVariables }
}

export const mecanismSynchronisation = (recurse, v) => {
	return {
		explanation: { ...v, API: recurse(v.API) },
		jsx: function Synchronisation({ explanation }) {
			return (
				<p>
					Obtenu à partir de la saisie{' '}
					<RuleLinkWithContext dottedName={explanation.API.dottedName} />
				</p>
			)
		},
		category: 'mecanism',
		name: 'synchronisation',
		nodeKind: 'synchronisation'
	}
}

registerEvaluationFunction('synchronisation', evaluate)
