import { createSelector } from 'reselect'

import { getStringOrNullFromPublicodesExpression } from '@/utils/publicodes/getStringOrNullFromPublicodesExpression'

import { companySituationSelector } from './companySituation.selector'

export const companySirenSelector = createSelector(
	[companySituationSelector],
	(companySituation) =>
		getStringOrNullFromPublicodesExpression(
			companySituation['entreprise . SIREN']
		)
)
