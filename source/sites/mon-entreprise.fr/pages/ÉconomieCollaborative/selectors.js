import { hasConditions } from './activitésData'

const filterActivités = (filter = () => true) => state =>
	Object.entries(state)
		.filter(
			([activitéTitle, activitéData]) =>
				activitéData.effectuée && filter(activitéData, activitéTitle)
		)
		.map(([activité]) => activité)

export const nextActivitéSelector = state =>
	filterActivités(
		({ répondue }, activitéTitle) => hasConditions(activitéTitle) && !répondue
	)(state)[0]

export const activitésEffectuéesSelector = filterActivités()
export const déclarationsSelector = state => ({
	PRO: filterActivités(({ déclaration }) =>
		['RÉGIME_GÉNÉRAL_NON_DISPONIBLE', 'PRO'].includes(déclaration)
	)(state),
	AUCUN: filterActivités(({ déclaration }) => déclaration === 'AUCUN')(state),
	IMPOSITION: filterActivités(
		({ déclaration }) => déclaration === 'IMPOSITION'
	)(state)
})

export const régimeGénéralNonDisponibleSelector = state =>
	Object.values(state).some(
		({ déclaration }) => déclaration === 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
	)
