import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation.selector'

export const questionsSuivantesSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.questionsSuivantes || []
)
