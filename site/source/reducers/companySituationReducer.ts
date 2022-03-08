import { DottedName } from '@/../../modele-social'
import { Action } from '@/actions/actions'
import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { Situation } from './rootReducer'

const SAVED_NAMESPACES = [
	'contrat salarié . ATMP',
	'contrat salarié . convention collective',
	'dirigeant . gérant minoritaire',
	'dirigeant . indépendant . PL . métier',
	'entreprise . ACRE',
	'entreprise . activité',
	'entreprise . catégorie juridique',
	'entreprise . date de création',
	'entreprise . effectif',
	'entreprise . exonérée de TVA',
	'entreprise . imposition',
	'entreprise . SIREN',
	'entreprise . nom',
	'établissement . adresse',
	'établissement . localisation',
] as Array<DottedName>

export type Company = Omit<FabriqueSocialEntreprise, 'highlightLabel'>

export function companySituation(state: Situation = {}, action: Action) {
	switch (action.type) {
		case 'UPDATE_SITUATION':
			if (
				SAVED_NAMESPACES.some((namespace) =>
					action.fieldName.startsWith(namespace)
				)
			) {
				return {
					[action.fieldName]: action.value,
					...state,
				}
			}
			break
		case 'COMPANY::SET_EXISTING_COMPANY':
			return getCompanySituation(action.entreprise)
		case 'COMPANY::RESET':
			return {}
		case 'COMPANY::ADD_COMMUNE_DETAILS':
			return {
				...state,
				'établissement . localisation': { objet: action.details },
			}
		case 'SET_SIMULATION':
			state['entreprise . SIREN'] ? state : {}
	}
	return state
}

export function getCompanySituation(company: Company): Situation {
	return {
		'entreprise . date de création': company.dateCreationUniteLegale.replace(
			/(.*)-(.*)-(.*)/,
			'$3/$2/$1'
		),
		'entreprise . catégorie juridique': `'${getCatégorieFromCode(
			company.categorieJuridiqueUniteLegale
		)}'`,
		'entreprise . SIREN': `'${company.siren}'`,
		'entreprise . nom': `'${company.label}'`,
		'établissement . SIRET': `'${company.firstMatchingEtablissement.siret}'`,
	}
}

type CatégorieJuridique = 'EI' | 'SARL' | 'SAS' | 'SELARL' | 'SELAS' | 'AUTRE'

const getCatégorieFromCode = (code: string): CatégorieJuridique => {
	/*
	Nous utilisons le code entreprise pour connaitre le statut juridique
	(voir https://www.insee.fr/fr/information/2028129)

	En revanche, impossible de différencier EI et auto-entreprise
	https://www.sirene.fr/sirene/public/question.action?idQuestion=2933
	*/

	if (code === '1000') {
		return 'EI'
	}
	if (code === '5485') {
		return 'SELARL'
	}
	if (code === '5470') {
		return 'AUTRE'
	}
	if (/^54..$/.exec(code)) {
		return 'SARL'
	}
	if (code === '5785') {
		return 'SELAS'
	}
	if (code === '5710') {
		return 'SAS'
	}
	return 'AUTRE'
}

// // Profession Libérale
// const inferPLSimulateurFromCompanyDetails = (
// 	company: Company | null
// ): DirigeantOrNull => {
// 	if (!company) {
// 		return null
// 	}
// 	const activiteToSimulator = {
// 		'Activités comptables': 'expert-comptable',
// 		'Activité des médecins généralistes': 'médecin',
// 		'Activités de radiodiagnostic et de radiothérapie': 'médecin',
// 		'Activités chirurgicales': 'médecin',
// 		'Activité des médecins spécialistes': 'médecin',
// 		'Activités hospitalières': 'pamc',
// 		'Pratique dentaire': 'chirurgien-dentiste',
// 		'Commerce de détail de produits pharmaceutiques en magasin spécialisé':
// 			'pharmacien',
// 		'Activités des infirmiers et des sages-femmes': 'pamc',
// 		"Activités des professionnels de la rééducation, de l'appareillage et des pédicures-podologues":
// 			'auxiliaire-médical',
// 		"Laboratoires d'analyses médicales": 'pharmacien',
// 		'Arts du spectacle vivant': 'artiste-auteur',
// 		'Création artistique relevant des arts plastiques': 'artiste-auteur',
// 		'Autre création artistique': 'artiste-auteur',
// 		'Activités photographiques': 'artiste-auteur',
// 	} as Record<string, keyof SimulatorData>
// 	return activiteToSimulator[company.activitePrincipale] || null
// }
