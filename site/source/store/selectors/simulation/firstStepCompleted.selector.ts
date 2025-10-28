import { difference } from 'effect/Array'
import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

export const firstStepCompletedSelector = createSelector(
	[situationSelector, configSelector],
	(situation, config) =>
		difference(
			Object.keys(situation),
			config['règles à ignorer pour déclencher les questions'] || []
		).length > 0
)
