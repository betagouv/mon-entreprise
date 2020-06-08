import { hasConditions } from './activitésData'

const filterActivités = (filter = () => true) => state =>
	Object.entries(state)
		.filter(
			([activitéTitle, activitéData]) =>
				activitéData.effectuée && filter(activitéData, activitéTitle)
		)
		.map(([activité]) => activité)

export const nextActivitéSelector = (state, currentActivité) =>
	filterActivités(
		({ vue }, activitéTitle) => !vue && activitéTitle !== currentActivité
	)(state)[0]

const estExonérée = critèresExonération =>
	!!critèresExonération.length && critèresExonération.every(Boolean)

export const estExonéréeSelector = activité => state =>
	estExonérée(state[activité].critèresExonération)

export const activitésEffectuéesSelector = filterActivités()
export const activitésRéponduesSelector = filterActivités(
	({ vue }, activité) => vue && hasConditions(activité)
)
export const déclarationsSelector = state => ({
	RÉGIME_GÉNÉRAL_DISPONIBLE: filterActivités(
		({ seuilRevenus, critèresExonération }) =>
			['RÉGIME_GÉNÉRAL_NON_DISPONIBLE', 'RÉGIME_GÉNÉRAL_DISPONIBLE'].includes(
				seuilRevenus
			) && !estExonérée(critèresExonération)
	)(state),
	AUCUN: filterActivités(
		({ seuilRevenus, critèresExonération }) =>
			seuilRevenus === 'AUCUN' || estExonérée(critèresExonération)
	)(state),
	IMPOSITION: filterActivités(
		({ seuilRevenus, critèresExonération }) =>
			seuilRevenus === 'IMPOSITION' && !estExonérée(critèresExonération)
	)(state)
})

export const régimeGénéralDisponibleSelector = (state, activité) =>
	state[activité].seuilRevenus === 'RÉGIME_GÉNÉRAL_DISPONIBLE' &&
	!estExonérée(state[activité].critèresExonération)
