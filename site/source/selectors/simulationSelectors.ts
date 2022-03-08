import { RootState, SimulationConfig, Situation } from '@/reducers/rootReducer'
import { DottedName } from 'modele-social'

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
	return objectifs as Array<DottedName>
}

const emptySituation: Situation = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const companySituationSelector = (state: RootState) =>
	state.companySituation

export const firstStepCompletedSelector = (state: RootState) => {
	const situation = situationSelector(state)
	return Object.keys(situation).length > 0
}

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: RootState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: RootState) =>
	state.simulation?.foldedSteps ?? []
