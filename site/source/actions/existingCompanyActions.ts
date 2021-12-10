import { FabriqueSocialEntreprise } from 'API/fabrique-social'
import { ApiCommuneJson } from 'Components/conversation/select/SelectCommune'

export type ActionExistingCompany = ReturnType<
	| typeof specifyIfAutoEntrepreneur
	| typeof specifyIfDirigeantMajoritaire
	| typeof resetEntreprise
	| typeof setCompany
	| typeof addCommuneDetails
>

export const specifyIfAutoEntrepreneur = (isAutoEntrepreneur: boolean) =>
	({
		type: 'EXISTING_COMPANY::SPECIFY_AUTO_ENTREPRENEUR',
		isAutoEntrepreneur,
	} as const)

export const specifyIfDirigeantMajoritaire = (
	isDirigeantMajoritaire: boolean
) =>
	({
		type: 'EXISTING_COMPANY::SPECIFY_DIRIGEANT_MAJORITAIRE',
		isDirigeantMajoritaire,
	} as const)

export const resetEntreprise = () =>
	({
		type: 'EXISTING_COMPANY::RESET',
	} as const)

export const addCommuneDetails = (details: ApiCommuneJson) =>
	({
		type: 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS',
		details,
	} as const)

export const setCompany = (entreprise: FabriqueSocialEntreprise) => {
	return {
		type: 'EXISTING_COMPANY::SET_COMPANY',
		entreprise,
	} as const
}
