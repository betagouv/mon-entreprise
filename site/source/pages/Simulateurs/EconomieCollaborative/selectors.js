import { getActivité, hasConditions } from './activitésData'

const filterActivités =
	(filter = () => true) =>
	(state) =>
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

const estExonérée = (critèresExonération, activité) => {
	if (!critèresExonération.length) {
		return false
	}
	if (getActivité(activité)['exonérée si']) {
		return critèresExonération.some(Boolean)
	}
	return critèresExonération.every((value) => value === false)
}

export const estExonéréeSelector = (activité) => (state) =>
	estExonérée(state[activité].critèresExonération, activité)

export const activitésEffectuéesSelector = filterActivités()
export const activitésRéponduesSelector = filterActivités(
	({ vue }, activité) => vue && hasConditions(activité)
)
export const déclarationsSelector = (state) => ({
	RÉGIME_GÉNÉRAL_DISPONIBLE: filterActivités(
		({ seuilRevenus, critèresExonération }, activité) =>
			['RÉGIME_GÉNÉRAL_NON_DISPONIBLE', 'RÉGIME_GÉNÉRAL_DISPONIBLE'].includes(
				seuilRevenus
			) && !estExonérée(critèresExonération, activité)
	)(state),
	AUCUN: filterActivités(
		({ seuilRevenus, critèresExonération }, activité) =>
			seuilRevenus === 'AUCUN' || estExonérée(critèresExonération, activité)
	)(state),
	IMPOSITION: filterActivités(
		({ seuilRevenus, critèresExonération }, activité) =>
			seuilRevenus === 'IMPOSITION' &&
			!estExonérée(critèresExonération, activité)
	)(state),
})

export const régimeGénéralDisponibleSelector = (state, activité) =>
	state[activité].seuilRevenus === 'RÉGIME_GÉNÉRAL_DISPONIBLE' &&
	!estExonérée(state[activité].critèresExonération, activité)
