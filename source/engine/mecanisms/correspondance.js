import { evaluateNode } from 'Engine/evaluation'

import Correspondance from 'Engine/mecanismViews/Correspondance'

export default (recurse, k, v) => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let { variable: variableName, tableau } = node.explanation

		let variable = evaluateNode(
			cache,
			situationGate,
			parsedRules,
			recurse(variableName)
		)

		if (variable.nodeValue == null)
			return {
				...node,
				nodeValue: null,
				explanation: v,
				missingVariables: { [variable.dottedName]: 1 }
			}
		else
			return {
				...node,
				nodeValue: tableau[variable.nodeValue],
				explanation: { ...v, selected: variable.nodeValue },
				missingVariables: {}
			}
	}

	return {
		explanation: v,
		evaluate,
		jsx: Correspondance,
		category: 'mecanism',
		name: 'correspondance'
	}
}
