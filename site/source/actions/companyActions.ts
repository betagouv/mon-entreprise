import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { ApiCommuneJson } from '@/components/conversation/select/SelectCommune'

export type CompanyActions = ReturnType<
	typeof resetCompany | typeof setCompany | typeof addCommuneDetails
>

export const resetCompany = () =>
	({
		type: 'COMPANY::RESET',
	} as const)

export const addCommuneDetails = (details: ApiCommuneJson) =>
	({
		type: 'COMPANY::ADD_COMMUNE_DETAILS',
		details,
	} as const)

export const setCompany = (entreprise: FabriqueSocialEntreprise) => {
	return {
		type: 'COMPANY::SET_EXISTING_COMPANY',
		entreprise,
	} as const
}
