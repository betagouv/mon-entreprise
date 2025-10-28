import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const simulationUrlSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.url
)
