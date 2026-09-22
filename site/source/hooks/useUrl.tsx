import { isPériodeDeCalcul } from '@/components/Simulateur/ChoixPeriodeDeCalcul'
import { PARAMÈTRE_SITUATION, PARAMÈTRE_UNITÉ } from '@/domaine/parametresUrl'
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

	if (situationEncodée === null) {
		return siteUrl + path + '?' + searchParamsPublicodes
	}

	const params = new URLSearchParams()
	params.set(PARAMÈTRE_SITUATION, situationEncodée)

	const unité = searchParams.get(PARAMÈTRE_UNITÉ)
	if (isPériodeDeCalcul(unité)) {
		params.set(PARAMÈTRE_UNITÉ, unité)
	}

	return siteUrl + path + '?' + params.toString()
}
