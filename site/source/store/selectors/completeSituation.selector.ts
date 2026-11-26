import { createSelector } from 'reselect'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { configSituationSelector } from '@/store/selectors/simulation/config/configSituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

export const completeSituationSelector = createSelector(
	[situationSelector, configSituationSelector],
	(simulatorSituation, configSituation) =>
		({
			...configSituation,
			...simulatorSituation,
		}) as SituationPublicodes
)
