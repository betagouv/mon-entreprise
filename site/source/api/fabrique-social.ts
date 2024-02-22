import { codeActivité } from '@/domain/CodeActivite'
import { codeCatégorieJuridique } from '@/domain/CodeCatégorieJuridique'
import { Entreprise } from '@/domain/Entreprise'
import { Établissement } from '@/domain/Établissement'
import { siren, siret } from '@/domain/Siren'

export async function searchDenominationOrSiren(
	searchTerm: string
): Promise<Array<Entreprise> | null> {
	return searchFullText(searchTerm).then(
		(entreprises) => entreprises?.map(fabriqueSocialEntrepriseAdapter) || null
	)
}

export const fabriqueSocialEntrepriseAdapter = (
	entreprise: FabriqueSocialEntreprise
): Entreprise => {
	const siège = entreprise && getSiege(entreprise)

	return {
		nom: entreprise.label,
		siren: siren(entreprise.siren),
		dateDeCréation: new Date(entreprise.dateCreationUniteLegale),
		codeCatégorieJuridique: codeCatégorieJuridique(
			entreprise.categorieJuridiqueUniteLegale
		),
		activitéPrincipale: codeActivité(entreprise.activitePrincipale),
		siège: siège && établissementAdapter(siège),
		établissement: établissementAdapter(entreprise.firstMatchingEtablissement),
	}
}

const établissementAdapter = (
	fabriqueSocialEtablissement: FabriqueSocialEtablissement
): Établissement => ({
	siret: siret(fabriqueSocialEtablissement.siret),
	activitéPrincipale: codeActivité(
		fabriqueSocialEtablissement.activitePrincipaleEtablissement
	),
	adresse: {
		complète: fabriqueSocialEtablissement.address,
		codePostal: fabriqueSocialEtablissement.codePostalEtablissement,
		codeCommune: fabriqueSocialEtablissement.codeCommuneEtablissement,
	},
})

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
	firstMatchingEtablissement: FabriqueSocialEtablissement
	allMatchingEtablissements: Array<FabriqueSocialEtablissement>
}

export type FabriqueSocialEtablissement = {
	address?: string
	siret: string
	etatAdministratifEtablissement?: 'F' | 'A' // Fermé ou Actif
	codeCommuneEtablissement: string
	codePostalEtablissement: string
	etablissementSiege: boolean
	activitePrincipaleEtablissement: string
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

function getSiege(
	entreprise: FabriqueSocialEntreprise
): FabriqueSocialEtablissement | undefined {
	return entreprise.allMatchingEtablissements.find(
		(etablissement) => etablissement.etablissementSiege
	)
}
