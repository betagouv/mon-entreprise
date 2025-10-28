import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const questionsRéponduesSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.questionsRépondues ?? []
)
