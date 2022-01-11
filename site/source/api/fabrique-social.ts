export { fetchCompanyDetails } from './sirene'

export async function searchDenominationOrSiren(value: string) {
	return searchFullText(value)
}

/*
 * Fields are documented in https://www.sirene.fr/static-resources/doc/Description%20fichier%20StockUniteLegaleHistorique.pdf?version=1.33.1
 */
export type FabriqueSocialEntreprise = {
	activitePrincipale: string
	caractereEmployeurUniteLegale?: 'N' | 'O'
	categorieJuridiqueUniteLegale: string
	dateCreationUniteLegale: string
	conventions: Array<{
		idcc: number
		shortTitle: string
		etat: string
		id: string
		texte_de_base: string
		title: string
		url: string
	}>
	etablissements: number
	etatAdministratifUniteLegale: 'A' | 'C' // A: Active, C: Cessée
	highlightLabel: string
	label: string
	simpleLabel: string
	siren: string
	firstMatchingEtablissement: {
		address?: string
		siret: string
		etatAdministratifEtablissement?: 'F' | 'A' // Fermé ou Actif
		codeCommuneEtablissement: string
		is_siege: boolean
	}
	allMatchingEtablissements: Array<{
		address?: string
		siret: string
		is_siege: boolean
	}>
}

type FabriqueSocialSearchPayload = {
	entreprises: Array<FabriqueSocialEntreprise>
}

const COMPANY_SEARCH_HOST =
	process.env.COMPANY_SEARCH_HOST ||
	'https://search-recherche-entreprises.fabrique.social.gouv.fr'

const makeSearchUrl = (query: string, limit: number) =>
	`${COMPANY_SEARCH_HOST}/api/v1/search?query=${query}&open=true&convention=false&employer=false&ranked=false&limit=${limit}`

async function searchFullText(
	text: string,
	limit = 10
): Promise<Array<FabriqueSocialEntreprise> | null> {
	const response = await fetch(makeSearchUrl(text, limit))

	if (!response.ok) {
		return null
	}

	const json: FabriqueSocialSearchPayload = await response.json()
	return json.entreprises
}
