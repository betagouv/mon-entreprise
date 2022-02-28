import { setSimulationConfig } from '@/actions/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Company } from '@/reducers/inFranceAppReducer'
import { RootState, SimulationConfig, Situation } from '@/reducers/rootReducer'
import { configSelector } from '@/selectors/simulationSelectors'

export default function useSimulationConfig(
	config: SimulationConfig | undefined,
	{ useExistingCompanyFromSituation = false } = {}
) {
	const dispatch = useDispatch()
	// TODO : Reading the URL here is buggy because when we do SPA navigation the
	// "location" retrieved at this point is still the previous URL. What we
	// actually need is to have a simulator identifier, which is currently not
	// accessible from the situation config but is defined in the metadata file.
	const url = useHistory().location.pathname.split('?')[0]

	const existingCompany = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const initialSituation = useExistingCompanyFromSituation
		? getCompanySituation(existingCompany)
		: undefined

	const lastConfig = useSelector(configSelector)
	useEffect(() => {
		if (config && lastConfig !== config) {
			dispatch(setSimulationConfig(config ?? {}, url, initialSituation))
		}
	}, [config, dispatch, lastConfig, initialSituation, url])
}

export function getCompanySituation(company: Company | null): Situation {
	return {
		...(company?.localisation && {
			'établissement . localisation': { objet: company.localisation },
		}),
		...(company?.dateCreationUniteLegale && {
			'entreprise . date de création': company.dateCreationUniteLegale.replace(
				/(.*)-(.*)-(.*)/,
				'$3/$2/$1'
			),
		}),
	}
}
