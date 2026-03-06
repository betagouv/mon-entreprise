import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const situationSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.situation ?? {}
)
