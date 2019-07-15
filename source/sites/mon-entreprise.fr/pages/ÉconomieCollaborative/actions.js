export const selectSeuilRevenus = (activité, seuilAtteint) => ({
	type: 'SELECT_SEUIL_REVENUS_ATTEINT',
	activité,
	seuilAtteint
})

export const toggleActivité = activité => ({
	type: 'TOGGLE_ACTIVITÉ_EFFECTUÉE',
	activité
})

export const activitéVue = activité => ({
	type: 'ACTIVITÉ_VUE',
	activité
})

export const changeCritèreExonération = (activité, index, estRespecté) => ({
	type: 'CHANGE_CRITÈRE_EXONÉRATION',
	activité,
	index,
	estRespecté
})
