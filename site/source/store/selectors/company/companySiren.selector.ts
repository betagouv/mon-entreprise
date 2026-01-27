import { createSelector } from 'reselect'

import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { getStringOrNullFromPublicodesExpression } from '@/utils/publicodes/getStringOrNullFromPublicodesExpression'

export const companySirenSelector = createSelector(
	[companySituationSelector],
	(companySituation) =>
		getStringOrNullFromPublicodesExpression(
			companySituation['entreprise . SIREN']
		)
)
