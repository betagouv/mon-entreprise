import { useSelector } from 'react-redux'

import { getSearchParamsFromSituation } from '@/domaine/searchParams'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

export const useSearchParamsForSituation = (
	situation?: SituationPublicodes
): string => {
	const currentSituation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const targetUnit = useSelector(targetUnitSelector)

	const searchParams = getSearchParamsFromSituation(
		situation ?? currentSituation,
		targetUnit
	)

	return searchParams.toString()
}
