import { evaluateNode } from 'Engine/evaluation'

export let evaluateControls = (cache, situationGate, parsedRules) => {
	return Object.values(parsedRules)
		.filter(rule => !!rule.contrôles)
		.map(rule =>
			rule.contrôles.map(contrôle => ({
				...contrôle,
				evaluated: evaluateNode(
					{ ...cache, contextRule: [rule.dottedName] },
					situationGate,
					parsedRules,
					contrôle.testExpression
				)
			}))
		)
		.flat()
		.filter(contrôle => contrôle.evaluated.nodeValue === true)
}
