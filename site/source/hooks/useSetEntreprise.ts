import {
	setBénéficeType,
	addCommuneDetails,
	setCompany,
} from '@/actions/companyActions'
import fetchBénéfice from '@/api/activité-vers-bénéfice'
import { fetchCommuneDetails } from '@/api/commune'
import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { useDispatch } from 'react-redux'

export function useSetEntreprise() {
	const dispatch = useDispatch()

	return (entreprise: FabriqueSocialEntreprise | null) => {
		if (entreprise === null) {
			return
		}

		dispatch(setCompany(entreprise))

		void fetchCommuneDetails(
			entreprise.firstMatchingEtablissement.codeCommuneEtablissement,
			entreprise.firstMatchingEtablissement.codePostalEtablissement
		).then(
			(communeDetails) =>
				communeDetails && dispatch(addCommuneDetails(communeDetails))
		)

		void fetchBénéfice(
			entreprise.firstMatchingEtablissement.activitePrincipaleEtablissement
		).then((bénéfice) => bénéfice && dispatch(setBénéficeType(bénéfice)))
	}
}
