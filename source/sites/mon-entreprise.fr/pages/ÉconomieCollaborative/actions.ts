export type Action =
	| ReturnType<typeof selectSeuilRevenus>
	| ReturnType<typeof toggleActivité>
	| ReturnType<typeof activitéVue>
	| ReturnType<typeof changeCritèreExonération>

export const selectSeuilRevenus = (activité, seuilAtteint: number) =>
	({
		type: 'SELECT_SEUIL_REVENUS_ATTEINT',
		activité,
		seuilAtteint
	} as const)

export const toggleActivité = activité =>
	({
		type: 'TOGGLE_ACTIVITÉ_EFFECTUÉE',
		activité
	} as const)

export const activitéVue = activité =>
	({
		type: 'ACTIVITÉ_VUE',
		activité
	} as const)

export const changeCritèreExonération = (activité, index, estRespecté) =>
	({
		type: 'CHANGE_CRITÈRE_EXONÉRATION',
		activité,
		index,
		estRespecté
	} as const)
