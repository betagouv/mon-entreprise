import { DottedName } from 'modele-social'
import { RootState, SimulationConfig } from 'Reducers/rootReducer'
import { createSelector } from 'reselect'

export const configSelector = (state: RootState): Partial<SimulationConfig> =>
	state.simulation?.config ?? {}

export const objectifsSelector = createSelector([configSelector], (config) => {
	const primaryObjectifs = (config.objectifs ?? ([] as any))
		.map((obj: DottedName | { objectifs: Array<DottedName> }) =>
			typeof obj === 'string' ? [obj] : obj.objectifs
		)
		.flat()

	const objectifs = [...primaryObjectifs, ...(config['objectifs cachés'] ?? [])]
	return objectifs
})

const emptySituation: Partial<
	Record<DottedName, string | number | Record<string, unknown>>
> = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const firstStepCompletedSelector = createSelector(
	[situationSelector, objectifsSelector],
	(situation, objectifs) => {
		if (!situation) {
			return false
		}
		return objectifs.some((objectif) => {
			return Object.entries(situation).some(([dottedName]) => dottedName.startsWith(objectif))
		})
	}
)

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: RootState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: RootState) =>
	state.simulation?.foldedSteps ?? []
