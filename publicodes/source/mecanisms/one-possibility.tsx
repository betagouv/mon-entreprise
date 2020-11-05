import { registerEvaluationFunction } from '../evaluation'

// TODO : This isn't a real mecanism, cf. #963
export const mecanismOnePossibility = (recurse, v, dottedName) => ({
	...v,
	'une possibilité': 'oui',
	context: dottedName,
	nodeKind: 'une possibilité'
})

registerEvaluationFunction(
	'une possibilité',
	(node: ReturnType<typeof mecanismOnePossibility>) => ({
		...node,
		missingVariables: { [node.context]: 1 }
	})
)
