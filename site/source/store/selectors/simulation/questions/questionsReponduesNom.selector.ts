import { createSelector } from 'reselect'

import { questionsRéponduesSelector } from '@/store/selectors/simulation/questions/questionsRepondues.selector'

export const questionsRéponduesNomSelector = createSelector(
	[questionsRéponduesSelector],
	(liste) => liste.map((q) => q.règle)
)
