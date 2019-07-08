export const selectSeuilRevenus = (activité, seuilAtteint) => ({
	type: 'SELECT_SEUIL_REVENUS_ATTEINT',
	activité,
	seuilAtteint
})

export const toggleActivité = (activité, activitéParente) => ({
	type: 'TOGGLE_ACTIVITÉ_EFFECTUÉE',
	activité,
	activitéParente
})

export const changeCritèreÉxonération = (activité, critère, estRespecté) => ({
	type: 'CHANGE_CRITÈRE_ÉXONÉRATION',
	activité,
	critère,
	estRespecté
})
