import { ApiCommuneJson } from 'Components/conversation/select/SelectCommune'

export type ActionExistingCompany = ReturnType<
	| typeof specifyIfAutoEntrepreneur
	| typeof specifyIfDirigeantMajoritaire
	| typeof resetEntreprise
	| typeof setSiren
	| typeof setCompanyDetails
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

export const setSiren = (siren: string) =>
	({
		type: 'EXISTING_COMPANY::SET_SIREN',
		siren,
	} as const)

export const setCompanyDetails = (
	catégorieJuridique: string,
	dateDeCréation: string,
	codeNAF: string
) =>
	({
		type: 'EXISTING_COMPANY::SET_DETAILS',
		catégorieJuridique,
		dateDeCréation,
		codeNAF,
	} as const)

export const addCommuneDetails = (details: ApiCommuneJson) =>
	({
		type: 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS',
		details,
	} as const)
