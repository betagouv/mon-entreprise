import { createSelector } from 'reselect'

import { configSelector } from './config.selector'

export const modeleIdSelector = createSelector(
	[configSelector],
	(config) => config.modeleId
)
