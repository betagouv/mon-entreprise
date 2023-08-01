export type Action =
	| ReturnType<typeof selectSeuilRevenus>
	| ReturnType<typeof toggleActivité>
	| ReturnType<typeof activitéVue>
	| ReturnType<typeof changeCritèreExonération>

export const selectSeuilRevenus = (
	activité: string,
	seuilAtteint:
		| 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
		| 'RÉGIME_GÉNÉRAL_DISPONIBLE'
		| 'IMPOSITION'
		| 'AUCUN'
) =>
	({
		type: 'SELECT_SEUIL_REVENUS_ATTEINT',
		activité,
		seuilAtteint,
	}) as const

export const toggleActivité = (activité: string) =>
	({
		type: 'TOGGLE_ACTIVITÉ_EFFECTUÉE',
		activité,
	}) as const

export const activitéVue = (activité: string) =>
	({
		type: 'ACTIVITÉ_VUE',
		activité,
	}) as const

export const changeCritèreExonération = (
	activité: string,
	index: string,
	estRespecté: boolean
) =>
	({
		type: 'CHANGE_CRITÈRE_EXONÉRATION',
		activité,
		index,
		estRespecté,
	}) as const
