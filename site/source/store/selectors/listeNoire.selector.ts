import { createSelector } from 'reselect'

import { configSelector } from './config.selector'

export const listeNoireSelector = createSelector(
	[configSelector],
	(config) => config.questions?.['liste noire'] ?? []
)
