import { ApiCommuneJson } from 'Components/conversation/select/SelectCommune'
import { fetchCompanyDetails } from '../api/sirene'

const fetchCommuneDetails = function(codeCommune: string) {
	return fetch(
		`https://geo.api.gouv.fr/communes/${codeCommune}?fields=departement,region`
	).then(response => {
		return response.json()
	})
}

export type ActionExistingCompany =
	| ReturnType<typeof specifyIfAutoEntrepreneur>
	| ReturnType<typeof specifyIfDirigeantMajoritaire>
	| ReturnType<typeof resetEntreprise>
	| {
			type: 'EXISTING_COMPANY::SET_SIREN'
			siren: string
	  }
	| {
			type: 'EXISTING_COMPANY::SET_DETAILS'
			catégorieJuridique: string
			dateDeCréation: string
	  }
	| {
			type: 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS'
			details: ApiCommuneJson
	  }

export const setEntreprise = (siren: string) => async (
	dispatch: (action: ActionExistingCompany) => void
) => {
	dispatch({
		type: 'EXISTING_COMPANY::SET_SIREN',
		siren
	} as ActionExistingCompany)
	const companyDetails = await fetchCompanyDetails(siren)
	dispatch({
		type: 'EXISTING_COMPANY::SET_DETAILS',
		catégorieJuridique: companyDetails.categorie_juridique,
		dateDeCréation: companyDetails.date_creation
	})
	const communeDetails: ApiCommuneJson = await fetchCommuneDetails(
		companyDetails.etablissement_siege.code_commune
	)
	dispatch({
		type: 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS',
		details: communeDetails
	} as ActionExistingCompany)
}

export const specifyIfAutoEntrepreneur = (isAutoEntrepreneur: boolean) =>
	({
		type: 'EXISTING_COMPANY::SPECIFY_AUTO_ENTREPRENEUR',
		isAutoEntrepreneur
	} as const)

export const specifyIfDirigeantMajoritaire = (
	isDirigeantMajoritaire: boolean
) =>
	({
		type: 'EXISTING_COMPANY::SPECIFY_DIRIGEANT_MAJORITAIRE',
		isDirigeantMajoritaire
	} as const)

export const resetEntreprise = () =>
	({
		type: 'EXISTING_COMPANY::RESET'
	} as const)
