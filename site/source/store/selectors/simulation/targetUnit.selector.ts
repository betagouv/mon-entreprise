import { createSelector } from 'reselect'

import { simulationSelector } from '@/store/selectors/simulation/simulation.selector'

export const targetUnitSelector = createSelector(
	[simulationSelector],
	(simulation) => simulation?.targetUnit ?? '€/mois'
)
