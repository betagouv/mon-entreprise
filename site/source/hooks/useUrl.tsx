import { PARAMÈTRE_SITUATION } from '@/domaine/parametre-situation'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { useCurrentSimulatorMetadata } from '@/hooks/useCurrentSimulatorMetadata'
import { useSearchParamsForSituation } from '@/hooks/useSearchParamsForSituation'
import { MergedSimulatorMetadata } from '@/hooks/useSimulatorsMetadata'
import { useSiteUrl } from '@/hooks/useSiteUrl'
import { useNavigation } from '@/lib/navigation'

type Options = {
	path?: MergedSimulatorMetadata['path']
	situation?: SituationPublicodes
}

export function useUrl(options?: Options) {
	const { currentSimulatorMetadata } = useCurrentSimulatorMetadata()
	const { searchParams } = useNavigation()
	const siteUrl = useSiteUrl()
	const searchParamsPublicodes = useSearchParamsForSituation(options?.situation)

	const { path = '' } = options?.path
		? { path: options.path as string }
		: (currentSimulatorMetadata ?? {})

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
