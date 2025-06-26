import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation.selector'

export const currentQuestionSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.currentQuestion ?? null
)
