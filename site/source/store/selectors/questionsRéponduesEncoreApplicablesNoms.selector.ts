import { createSelector } from 'reselect'

import { questionsRéponduesEncoreApplicablesSelector } from '@/store/selectors/questionsRéponduesEncoreApplicables.selector'

export const questionsRéponduesEncoreApplicablesNomsSelector = createSelector(
	[questionsRéponduesEncoreApplicablesSelector],
	(liste) => liste.map((q) => q.règle)
)
