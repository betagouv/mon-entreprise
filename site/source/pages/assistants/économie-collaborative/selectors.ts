import { getActivité, hasConditions } from './activitésData'
import { State } from './reducer'

const filterActivités =
	(
		filter: (
			activitéData: State[keyof State],
			activitéTitle: string
		) => boolean = () => true
	) =>
	(state: State) =>
		Object.entries(state)
			.filter(
				([activitéTitle, activitéData]) =>
					activitéData.effectuée && filter(activitéData, activitéTitle)
			)
			.map(([activité]) => activité)

export const nextActivitéSelector = (state: State, currentActivité?: string) =>
	filterActivités(
		({ vue }, activitéTitle) => !vue && activitéTitle !== currentActivité
	)(state)[0]

const estExonérée = (
	critèresExonération: State[keyof State]['critèresExonération'],
	activité: keyof State
) => {
	if (!critèresExonération.length) {
		return false
	}
	const acti = getActivité(activité)
	if ('exonérée si' in acti && acti['exonérée si']) {
		return critèresExonération.some(Boolean)
	}

	return critèresExonération.every((value) => value === false)
}

export const estExonéréeSelector = (activité: string) => (state: State) =>
	estExonérée(state[activité].critèresExonération, activité)

export const activitésEffectuéesSelector = filterActivités()
export const activitésRéponduesSelector = filterActivités(
	({ vue }, activité) => vue && hasConditions(activité)
)
export const déclarationsSelector = (state: State) => ({
	RÉGIME_GÉNÉRAL_DISPONIBLE: filterActivités(
		({ seuilRevenus, critèresExonération }, activité) =>
			['RÉGIME_GÉNÉRAL_NON_DISPONIBLE', 'RÉGIME_GÉNÉRAL_DISPONIBLE'].includes(
				seuilRevenus ?? ''
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

export const régimeGénéralDisponibleSelector = (
	state: State,
	activité: string
) =>
	state[activité].seuilRevenus === 'RÉGIME_GÉNÉRAL_DISPONIBLE' &&
	!estExonérée(state[activité].critèresExonération, activité)
