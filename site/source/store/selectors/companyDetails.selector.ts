import { createSelector } from 'reselect'

import { getStringOrNullFromPublicodesExpression } from '@/utils/publicodes/getStringOrNullFromPublicodesExpression'

import { companySituationSelector } from './companySituation.selector'

export const companyDetailsSelector = createSelector(
	[companySituationSelector],
	(companySituation) => {
		return {
			nom: getStringOrNullFromPublicodesExpression(
				companySituation['entreprise . nom']
			),
			siren: getStringOrNullFromPublicodesExpression(
				companySituation['entreprise . SIREN']
			),
			dateDeCréation: companySituation['entreprise . date de création'],
			commune: `${getStringOrNullFromPublicodesExpression(
				companySituation['établissement . commune . nom']
			)} (${getStringOrNullFromPublicodesExpression(
				companySituation['établissement . commune . code postal']
			)})`,
		}
	}
)
