import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const configSituationSelector = createSelector(
	[configSelector],
	(config) => config.situation ?? {}
)
