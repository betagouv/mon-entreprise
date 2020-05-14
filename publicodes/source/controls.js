import { evaluateNode } from './evaluation'

export let evaluateControls = (cache, situation, parsedRules) => {
	return Object.values(parsedRules)
		.filter(rule => !!rule.contrôles)
		.map(rule =>
			rule.contrôles.map(contrôle => ({
				...contrôle,
				evaluated: evaluateNode(
					{ ...cache, contextRule: [rule.dottedName] },
					situation,
					parsedRules,
					contrôle.testExpression
				)
			}))
		)
		.flat()
		.filter(contrôle => contrôle.evaluated.nodeValue === true)
}
