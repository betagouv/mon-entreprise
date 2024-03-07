import { createSelector } from 'reselect'

import { situationSelector } from '@/store/selectors/simulationSelectors'

export const acreActivéSelector = createSelector(
	[situationSelector],
	(situation) =>
		(situation['dirigeant . exonérations . ACRE'] || "'non'") === "'oui'"
)
