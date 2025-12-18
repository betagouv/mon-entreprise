import { createSelector } from 'reselect'

import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

import { listeNoireSelector } from './listeNoire.selector'

export const questionsRéponduesEncoreApplicablesSelector = createSelector(
	[questionsRéponduesSelector, listeNoireSelector],
	(répondues, listeNoire) =>
		répondues.filter((q) => q.applicable && listeNoire.indexOf(q.règle) === -1)
)
