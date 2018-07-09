let displayedTargetNames = [
	'contrat salarié . salaire . total',
	'contrat salarié . salaire . brut de base',
	'contrat salarié . salaire . net après impôts'
]

export let popularTargetNames = [
	...displayedTargetNames,
	'contrat salarié . salaire . net à payer' // Not computed by the above targets, needed for the payslip view
]

export default {
	popularTargetNames,
	displayedTargetNames
}
