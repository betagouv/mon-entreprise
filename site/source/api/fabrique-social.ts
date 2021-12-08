const isSIREN = (input: string) => /^[\s]*([\d][\s]*){9}$/.exec(input)
const isSIRET = (input: string) => /^[\s]*([\d][\s]*){14}$/.exec(input)

export { fetchCompanyDetails } from './sirene'

export async function searchDenominationOrSiren(value: string) {
	if (isSIRET(value)) {
		value = value.replace(/[\s]/g, '').slice(0, 9)
	}
	if (isSIREN(value)) {
		return [{ siren: value }]
	}
	return searchFullText(value)
}

/*
 * Fields are documented in https://www.sirene.fr/static-resources/doc/Description%20fichier%20StockUniteLegaleHistorique.pdf?version=1.33.1
 */
type FabriqueSocialEntreprise = {
	activitePrincipale: string
	caractereEmployeurUniteLegale?: 'N' | 'O'
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
	}
	allMatchingEtablissements: {
		address?: string
		siret: string
	}
}

type FabriqueSocialSearchPayload = {
	entreprises: Array<FabriqueSocialEntreprise>
}

const makeSearchUrl = (query: string) =>
	`https://search-recherche-entreprises.fabrique.social.gouv.fr/api/v1/search?query=${query}&open=false&convention=false&employer=false&ranked=false&limit=10`

export type Entreprise = {
	siren: string
	address?: string
	denomination?: string
}

async function searchFullText(text: string): Promise<Array<Entreprise> | null> {
	const response = await fetch(makeSearchUrl(text))

	if (!response.ok) {
		return null
	}

	const json: FabriqueSocialSearchPayload = await response.json()

	return json.entreprises.map(
		({ siren, simpleLabel, firstMatchingEtablissement: { address } }) => ({
			denomination: simpleLabel,
			address,
			siren,
		})
	)
}
