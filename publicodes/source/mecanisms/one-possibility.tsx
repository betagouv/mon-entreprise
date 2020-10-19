import { registerEvaluationFunction } from '../evaluation'

// TODO : This isn't a real mecanism, cf. #963
export const mecanismOnePossibility = dottedName => (recurse, v) => ({
	...v,
	'une possibilité': 'oui',
	context: dottedName,
	nodeKind: 'une possibilité'
})

registerEvaluationFunction(
	'une possibilité',
	(cache, situation, parsedRules, node) => ({
		...node,
		missingVariables: { [node.context]: 1 }
	})
)
