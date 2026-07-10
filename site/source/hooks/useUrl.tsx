import { PARAMÈTRE_SITUATION } from '@/domaine/parametre-situation'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { useSearchParamsForSituation } from '@/hooks/useSearchParamsForSituation'
import { useSiteUrl } from '@/hooks/useSiteUrl'
import { useNavigation } from '@/lib/navigation'

type Options = {
	path?: MergedSimulatorDataValues['path']
	situation?: SituationPublicodes
}

export function useUrl(options?: Options) {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { searchParams } = useNavigation()
	const siteUrl = useSiteUrl()
	const searchParamsPublicodes = useSearchParamsForSituation(options?.situation)

	const { path = '' } = options?.path
		? { path: options.path as string }
		: currentSimulatorData ?? {}

	const situationEncodée = options?.situation
		? null
		: searchParams.get(PARAMÈTRE_SITUATION)

	const queryString =
		situationEncodée === null
			? searchParamsPublicodes
			: new URLSearchParams({
					[PARAMÈTRE_SITUATION]: situationEncodée,
			  }).toString()

	return siteUrl + path + '?' + queryString
}
