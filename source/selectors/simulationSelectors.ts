import { DottedName } from './../rules/index'
import { createSelector } from 'reselect'

export const configSelector = state => state.simulation?.config ?? {}
export const objectifsSelector = createSelector([configSelector], config => {
	const primaryObjectifs = ((config.objectifs ?? []) as any)
		.map((obj: DottedName | { objectifs: Array<DottedName> }) =>
			typeof obj === 'string' ? [obj] : obj.objectifs
		)
		.flat()

	const objectifs = [...primaryObjectifs, ...(config['objectifs cachés'] ?? [])]
	return objectifs
})
const emptySituation = {}
export const situationSelector = state =>
	state.simulation?.situation ?? emptySituation
export const configSituationSelector = state =>
	configSelector(state).situation ?? emptySituation

export const firstStepCompletedSelector = createSelector(
	[situationSelector, objectifsSelector],
	(situation, objectifs) => {
		if (!situation) {
			return false
		}
		return objectifs.some(objectif => {
			return objectif in situation
		})
	}
)

export const targetUnitSelector = state =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = state =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = state =>
	state.simulation?.foldedSteps ?? []
