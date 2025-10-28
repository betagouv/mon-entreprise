import { createSelector } from 'reselect'

import { questionsRéponduesSelector } from '@/store/selectors/simulation/questions/questionsRépondues.selector'

export const questionsRéponduesEncoreApplicablesSelector = createSelector(
	[questionsRéponduesSelector],
	(répondues) => répondues.filter((q) => q.applicable)
)
