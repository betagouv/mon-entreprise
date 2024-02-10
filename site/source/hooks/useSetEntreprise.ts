import { useDispatch } from 'react-redux'

import fetchBénéfice from '@/api/activité-vers-bénéfice'
import { fetchCommuneDetails } from '@/api/commune'
import { Entreprise } from '@/domain/Entreprise'
import {
	addCommuneDetails,
	setBénéficeType,
	setCompany,
} from '@/store/actions/companyActions'

export function useSetEntreprise() {
	const dispatch = useDispatch()

	return (entreprise: Entreprise | null) => {
		if (entreprise === null || !entreprise.établissement.adresse) {
			return
		}

		dispatch(setCompany(entreprise))

		void fetchCommuneDetails(entreprise.établissement.adresse.codeCommune).then(
			(communeDetails) =>
				communeDetails && dispatch(addCommuneDetails(communeDetails))
		)

		void fetchBénéfice(entreprise.établissement.activitéPrincipale).then(
			(bénéfice) => bénéfice && dispatch(setBénéficeType(bénéfice))
		)
	}
}
