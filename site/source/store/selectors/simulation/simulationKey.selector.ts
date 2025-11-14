import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const simulationKeySelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.key
)
