// Each one will be a line in the simulation box
export let mainTargetNames = [
	'contrat salarié . rémunération . total',
	'contrat salarié . salaire . brut de base',
	'contrat salarié . salaire . net',
	'contrat salarié . salaire . net après impôt'
]

// Some others will be displayed too so need to be computed
export let simulationTargetNames = [
	...mainTargetNames,
	'contrat salarié . aides employeur'
]
