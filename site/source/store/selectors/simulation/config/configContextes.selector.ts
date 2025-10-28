import { createSelector } from 'reselect'

import { isComparateurConfig } from '@/domaine/ComparateurConfig'
import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const configContextesSelector = createSelector(
	[configSelector],
	(config) => (isComparateurConfig(config) ? config.contextes : undefined)
)
