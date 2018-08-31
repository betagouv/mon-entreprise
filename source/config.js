let salaries = [
	'contrat salarié . salaire . total',
	'contrat salarié . salaire . brut de base',
	'contrat salarié . salaire . net à payer'
]

export let displayedTargetNames = [
	...salaries,
	'contrat salarié . aides employeur'
]
export let popularTargetNames = [
	...displayedTargetNames,
	'contrat salarié . salaire . net imposable'
]

export default {
	popularTargetNames,
	displayedTargetNames
}
