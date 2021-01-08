import { setSimulationConfig } from 'Actions/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Company } from 'Reducers/inFranceAppReducer'
import { RootState, SimulationConfig, Situation } from 'Reducers/rootReducer'

export default function useSituationConfig(
	config: SimulationConfig | undefined,
	{ useExistingCompanyFromSituation = false } = {}
) {
	const dispatch = useDispatch()
	const url = useHistory().location.pathname
	const lastUrl = useSelector((state: RootState) => state.simulation?.url)
	const existingCompany = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const initialSituation = useExistingCompanyFromSituation
		? getCompanySituation(existingCompany)
		: undefined

	useEffect(() => {
		if (config && url !== lastUrl) {
			dispatch(setSimulationConfig(config ?? {}, url, initialSituation))
		}
	}, [config, url, lastUrl, initialSituation])
}

export function getCompanySituation(company: Company | null): Situation {
	return {
		...(company?.localisation && {
			'établissement . localisation': { objet: company.localisation },
		}),
		...(company?.dateDeCréation && {
			'entreprise . date de création': company.dateDeCréation.replace(
				/(.*)-(.*)-(.*)/,
				'$3/$2/$1'
			),
		}),
	}
}
