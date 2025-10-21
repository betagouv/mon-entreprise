import { difference, NonEmptyArray } from 'effect/Array'
import { createSelector } from 'reselect'

import { isComparateurConfig } from '@/domaine/ComparateurConfig'
import { RootState, SituationPublicodes } from '@/store/reducers/rootReducer'
import { configSelector } from '@/store/selectors/config.selector'

import { companySituationSelector } from './companySituation.selector'

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

const emptySituation: SituationPublicodes = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const configContextesSelector = createSelector(
	[configSelector],
	(config) => (isComparateurConfig(config) ? config.contextes : undefined)
)

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
			: [rawSituation]) as NonEmptyArray<SituationPublicodes>
)

export const firstStepCompletedSelector = createSelector(
	[situationSelector, configSelector],
	(situation, config) =>
		difference(
			Object.keys(situation),
			config['règles à ignorer pour déclencher les questions'] || []
		).length > 0
)

export const previousSimulationSelector = (state: RootState) =>
	state.previousSimulation

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'
