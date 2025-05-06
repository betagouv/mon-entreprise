import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation.selector'

export const configSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.config ?? {}
)
