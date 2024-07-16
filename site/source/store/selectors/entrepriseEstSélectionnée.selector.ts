import { createSelector } from 'reselect'

import { companySituationSelector } from './simulationSelectors'

export const entrepriseEstSélectionnéeSelector = createSelector(
	[companySituationSelector],
	(companySituation) => {
		return !!Object.keys(companySituation).length
	}
)
