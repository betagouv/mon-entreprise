import { createSelector } from 'reselect'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { configSituationSelector } from '@/store/selectors/simulation/config/configSituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

export const completeSituationSelector = createSelector(
	[situationSelector, configSituationSelector, companySituationSelector],
	(simulatorSituation, configSituation, companySituation) =>
		({
			...companySituation,
			...configSituation,
			...simulatorSituation,
		}) as SituationPublicodes
)
