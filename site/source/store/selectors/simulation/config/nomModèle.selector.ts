import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const nomModèleSelector = createSelector(
	[configSelector],
	(config) => config.nomModèle
)
