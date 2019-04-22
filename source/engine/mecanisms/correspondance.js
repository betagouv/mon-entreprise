import { rewriteNode, evaluateNode } from 'Engine/evaluation'

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
			return rewriteNode(node, null, v, { [variable.dottedName]: 1 })
		else
			return rewriteNode(
				node,
				tableau[variable.nodeValue],
				{ ...v, selected: variable.nodeValue },
				{}
			)
	}

	return {
		explanation: v,
		evaluate,
		jsx: Correspondance,
		category: 'mecanism',
		name: 'correspondance'
	}
}
