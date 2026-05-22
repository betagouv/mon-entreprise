import { difference } from 'effect/Array'
import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

export const firstStepCompletedSelector = createSelector(
	[situationSelector, configSelector],
	(situation, config) => {
		const règlesÀIgnorer = [
			...(config['règles à ignorer pour déclencher les questions'] || []),
			'date',
		]

		return difference(Object.keys(situation), règlesÀIgnorer).length > 0
	}
)
