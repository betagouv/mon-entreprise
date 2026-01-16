import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const configObjectifsSelector = createSelector(
	[configSelector],
	(config) => [
		...(config['objectifs exclusifs'] ?? []),
		...(config.objectifs ?? []),
	]
)
