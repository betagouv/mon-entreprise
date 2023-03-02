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
		codePostalEtablissement: string
		is_siege: boolean
		activitePrincipaleEtablissement: string
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
	import.meta.env.VITE_COMPANY_SEARCH_HOST ||
	'https://api.recherche-entreprises.fabrique.social.gouv.fr'

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

	const json = (await response.json()) as FabriqueSocialSearchPayload

	return json.entreprises
}
