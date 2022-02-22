import { DottedName } from 'modele-social'
import { RootState, SimulationConfig, Situation } from '~/reducers/rootReducer'

export const configSelector = (state: RootState): Partial<SimulationConfig> =>
	state.simulation?.config ?? {}

export const objectifsSelector = (state: RootState) => {
	const config = configSelector(state)
	const primaryObjectifs = (config.objectifs ?? ([] as any))
		.map((obj: DottedName | { objectifs: Array<DottedName> }) =>
			typeof obj === 'string' ? [obj] : obj.objectifs
		)
		.flat()

	const objectifs = [...primaryObjectifs, ...(config['objectifs cachés'] ?? [])]
	return objectifs
}

const emptySituation: Situation = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const initialSituationSelector = (state: RootState) =>
	state.simulation?.initialSituation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const firstStepCompletedSelector = (state: RootState) => {
	const situation = situationSelector(state)
	const baseSituation = configSituationSelector(state)
	const initialSituation = initialSituationSelector(state)
	return (
		Object.keys(situation).filter(
			(dottedName) =>
				!Object.keys(baseSituation).includes(dottedName) &&
				!Object.keys(initialSituation).includes(dottedName)
		).length > 0
	)
}

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: RootState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: RootState) =>
	state.simulation?.foldedSteps ?? []
