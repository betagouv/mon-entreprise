import { Bénéfice } from '@/api/activité-vers-bénéfice'
import { Commune } from '@/api/commune'
import { FabriqueSocialEntreprise } from '@/api/fabrique-social'

export type CompanyActions = ReturnType<
	| typeof resetCompany
	| typeof setCompany
	| typeof addCommuneDetails
	| typeof setBénéficeType
>

export const resetCompany = () =>
	({
		type: 'COMPANY::RESET',
	}) as const

export const addCommuneDetails = (details: Commune) =>
	({
		type: 'COMPANY::ADD_COMMUNE_DETAILS',
		details,
	}) as const

export const setBénéficeType = (bénéfice: NonNullable<Bénéfice>) =>
	({
		type: 'COMPANY::SET_BÉNÉFICE_TYPE',
		bénéfice,
	}) as const

export const setCompany = (entreprise: FabriqueSocialEntreprise) => {
	return {
		type: 'COMPANY::SET_EXISTING_COMPANY',
		entreprise,
	} as const
}
