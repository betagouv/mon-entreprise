import { createSelector } from 'reselect'

import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export const questionsRéponduesNomSelector = createSelector(
	[questionsRéponduesSelector],
	(liste) => liste.map((q) => q.règle)
)
