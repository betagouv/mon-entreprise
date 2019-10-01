import { fetchCompanyDetails } from '../api/sirene'

const fetchCommuneDetails = function(codeCommune) {
	return fetch(
		`https://geo.api.gouv.fr/communes/${codeCommune}?fields=departement,region`
	).then(response => {
		return response.json()
	})
}

export const setEntreprise = siren => async dispatch => {
	dispatch({
		type: 'EXISTING_COMPANY::SET_SIREN',
		siren
	})
	const companyDetails = await fetchCompanyDetails(siren)
	dispatch({
		type: 'EXISTING_COMPANY::SET_CATEGORIE_JURIDIQUE',
		catégorieJuridique: companyDetails.categorie_juridique
	})
	const communeDetails = await fetchCommuneDetails(
		companyDetails.etablissement_siege.code_commune
	)
	dispatch({
		type: 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS',
		details: communeDetails
	})
}

export const specifyIfAutoEntrepreneur = isAutoEntrepreneur => ({
	type: 'EXISTING_COMPANY::SPECIFY_AUTO_ENTREPRENEUR',
	isAutoEntrepreneur
})

export const resetEntreprise = () => ({
	type: 'EXISTING_COMPANY::RESET'
})
