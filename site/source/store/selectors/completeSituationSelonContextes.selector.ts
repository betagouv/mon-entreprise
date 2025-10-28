import { NonEmptyArray } from 'effect/Array'
import { createSelector } from 'reselect'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { completeSituationSelector } from '@/store/selectors/completeSituation.selector'
import { configContextesSelector } from '@/store/selectors/simulation/config/configContextes.selector'

export const completeSituationsSelonContextesSelector = createSelector(
	[completeSituationSelector, configContextesSelector],
	(completeSituation, contextes) =>
		(contextes
			? contextes.map((contexte) => ({
					...completeSituation,
					...contexte,
			  }))
			: [completeSituation]) as NonEmptyArray<SituationPublicodes>
)
