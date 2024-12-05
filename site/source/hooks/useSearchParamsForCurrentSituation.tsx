import { useSelector } from 'react-redux'

import { useParamsFromSituation } from '@/components/utils/useSearchParamsSimulationSharing'
import {
	companySituationSelector,
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'

export const useSearchParamsForCurrentSituation = <
	T extends boolean | undefined,
>(
	asString: T
): T extends true ? string : object => {
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const targetUnit = useSelector(targetUnitSelector)

	const searchParams = useParamsFromSituation(situation, targetUnit)

	return (asString ? searchParams.toString() : searchParams) as T extends true
		? string
		: object
}
