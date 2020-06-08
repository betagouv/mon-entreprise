// TODO : This isn't a real mecanism, cf. #963
export const mecanismOnePossibility = dottedName => (recurse, v) => ({
	...v,
	'une possibilité': 'oui',
	evaluate: (cache, situation, parsedRules, node) => ({
		...node,
		missingVariables: { [dottedName]: 1 }
	})
})
