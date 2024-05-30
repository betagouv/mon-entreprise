import { CodeActivite } from '@/domaine/CodeActivite'
import { CodeCatégorieJuridique } from '@/domaine/CodeCatégorieJuridique'
import { IsoDate, parseIsoDateString } from '@/domaine/Date'
import { Entreprise } from '@/domaine/Entreprise'
import { EntreprisesRepository } from '@/domaine/EntreprisesRepository'
import { Établissement } from '@/domaine/Établissement'
import { Siren, Siret } from '@/domaine/Siren'

/**
 * @see https://api.gouv.fr/documentation/api-recherche-entreprises
 */
export const RechercheEntreprisesGouvFr: EntreprisesRepository = {
	rechercheTexteLibre,
}

const makeSearchUrl = (q: string, limit: number) =>
	`https://recherche-entreprises.api.gouv.fr/search?q=${q}&etat_administratif=A&per_page=${limit}&mtm_campaign=mon-entreprise`

async function rechercheTexteLibre(text: string, limit = 10) {
	const response = await fetch(makeSearchUrl(text, limit))

	if (!response.ok) {
		return null
	}

	const json = (await response.json()) as ApiResponse

	return json.results.map(EntrepriseFromApiAdapter)
}

interface ApiResponse {
	results: Array<EntrepriseApi>
	total_results: number
	page: number
	per_page: number
	total_pages: number
}

interface EntrepriseApi {
	siren: Siren
	nom_complet: string
	nom_raison_sociale: string
	sigle: string
	date_creation: IsoDate
	nature_juridique: CodeCatégorieJuridique
	activite_principale: CodeActivite
	siege: EtablissementApi
	matching_etablissements: Array<EtablissementApi>
	nombre_etablissements: number
	nombre_etablissements_ouverts: number
}

const EntrepriseFromApiAdapter = (api: EntrepriseApi): Entreprise => {
	const siège = ÉtablissementFromApiAdapter(api.siege)
	const établissement = api.matching_etablissements.length
		? ÉtablissementFromApiAdapter(api.matching_etablissements[0])
		: siège

	return {
		nom: api.nom_complet,
		siren: api.siren,
		dateDeCréation: parseIsoDateString(api.date_creation),
		siège,
		établissement,
		activitéPrincipale: api.activite_principale,
		codeCatégorieJuridique: api.nature_juridique,
	}
}

interface EtablissementApi {
	siret: Siret
	adresse: string
	commune: string
	libelle_commune: string
	activite_principale: CodeActivite
	est_siege: boolean
	nom_commercial: string
}

const ÉtablissementFromApiAdapter = (api: EtablissementApi): Établissement => ({
	siret: api.siret,
	adresse: {
		complète: api.adresse,
		codeCommune: api.commune,
	},
	activitéPrincipale: api.activite_principale,
})
