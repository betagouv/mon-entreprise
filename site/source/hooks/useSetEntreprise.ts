import { useDispatch } from 'react-redux'

import fetchBénéfice from '@/api/activité-vers-bénéfice'
import { fetchCommuneDetails } from '@/api/commune'
import {
	FabriqueSocialEntreprise,
	getSiegeOrFirstEtablissement,
} from '@/api/fabrique-social'
import {
	addCommuneDetails,
	setBénéficeType,
	setCompany,
} from '@/store/actions/companyActions'

export function useSetEntreprise() {
	const dispatch = useDispatch()

	return (entreprise: FabriqueSocialEntreprise | null) => {
		if (entreprise === null) {
			return
		}

		dispatch(setCompany(entreprise))

		const siegeOrFirstEtablissement = getSiegeOrFirstEtablissement(entreprise)

		void fetchCommuneDetails(
			siegeOrFirstEtablissement.codeCommuneEtablissement
		).then(
			(communeDetails) =>
				communeDetails && dispatch(addCommuneDetails(communeDetails))
		)

		void fetchBénéfice(
			siegeOrFirstEtablissement.activitePrincipaleEtablissement
		).then((bénéfice) => bénéfice && dispatch(setBénéficeType(bénéfice)))
	}
}
