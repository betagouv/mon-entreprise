import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { useSearchParamsForCurrentSituation } from '@/hooks/useSearchParamsForCurrentSituation'
import { useSiteUrl } from '@/hooks/useSiteUrl'

export function useUrl() {
	const { currentSimulatorData } = useCurrentSimulatorData()

	const { path = '' } = currentSimulatorData ?? {}

	return useSiteUrl() + path + '?' + useSearchParamsForCurrentSituation()
}
