import { useSelector } from 'react-redux'

import { getSearchParamsFromSituation } from '@/domaine/searchParams'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import {
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'

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
