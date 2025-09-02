import { useSelector } from 'react-redux'

import { getSearchParamsFromSituation } from '@/hooks/useSearchParamsSimulationSharing'
import {
	companySituationSelector,
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'

export const useSearchParamsForCurrentSituation = (): string => {
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const targetUnit = useSelector(targetUnitSelector)

	const searchParams = getSearchParamsFromSituation(situation, targetUnit)

	return searchParams.toString()
}
