import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { useSearchParamsForSituation } from '@/hooks/useSearchParamsForSituation'
import { useSiteUrl } from '@/hooks/useSiteUrl'

type Options = {
	path?: Partial<MergedSimulatorDataValues>
	situation?: SituationPublicodes
}

export function useUrl(options?: Options) {
	const { currentSimulatorData } = useCurrentSimulatorData()

	const { path = '' } = options?.path
		? { path: options.path as string }
		: currentSimulatorData ?? {}

	return (
		useSiteUrl() + path + '?' + useSearchParamsForSituation(options?.situation)
	)
}
