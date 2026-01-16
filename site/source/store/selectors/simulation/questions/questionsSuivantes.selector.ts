import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const questionsSuivantesSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.questionsSuivantes || []
)
