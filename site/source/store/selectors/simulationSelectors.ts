import { NonEmptyArray } from 'effect/Array'
import { createSelector } from 'reselect'

import { isComparateurConfig } from '@/domaine/ComparateurConfig'
import { RootState, Situation } from '@/store/reducers/rootReducer'
import { configSelector } from '@/store/selectors/config.selector'

export const configObjectifsSelector = createSelector(
	[
		(state: RootState) => configSelector(state)['objectifs exclusifs'],
		(state: RootState) => configSelector(state).objectifs,
	],
	(objectifsExclusifs, objectifs) => [
		...(objectifsExclusifs ?? []),
		...(objectifs ?? []),
	]
)

const emptySituation: Situation = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const configContextesSelector = createSelector(
	[configSelector],
	(config) => (isComparateurConfig(config) ? config.contextes : undefined)
)

export const companySituationSelector = (state: RootState) =>
	state.companySituation

export const completeSituationSelector = createSelector(
	[situationSelector, configSituationSelector, companySituationSelector],
	(simulatorSituation, configSituation, companySituation) => ({
		...companySituation,
		...configSituation,
		...simulatorSituation,
	})
)

export const rawSituationsSelonContextesSelector = createSelector(
	[completeSituationSelector, configContextesSelector],
	(rawSituation, contextes) =>
		(contextes
			? contextes.map((contexte) => ({
					...rawSituation,
					...contexte,
			  }))
			: [rawSituation]) as NonEmptyArray<Situation>
)

export const firstStepCompletedSelector = (state: RootState) => {
	const situation = situationSelector(state)

	return (
		Object.keys(situation).filter(
			// Hack to prevent questions from showing after selection 'IR or IS' in the toggle above simulator
			(dottedName) => dottedName !== 'entreprise . imposition'
		).length > 0
	)
}

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const urlSelector = (state: RootState) => state.simulation?.url
