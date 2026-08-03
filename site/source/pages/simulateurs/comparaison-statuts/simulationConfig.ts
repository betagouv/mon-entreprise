import { TFunction } from 'i18next'

import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { ComparateurConfig } from '@/domaine/ComparateurConfig'
import { IndépendantContexte } from '@/domaine/IndépendantContexte'
import { AutoEntrepreneurContexteDansPublicodes } from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import {
	questionAcre,
	questionActivitéPrincipale,
	questionActivitéRéglementée,
	questionTypeActivité,
} from './questions/questionsPrincipales'
import { réponseActivité } from './questions/réponseActivité'
import { réponseFoyerFiscal } from './questions/réponseFoyerFiscal'
import { réponseImpôt } from './questions/réponseImpôt'

export const configComparateurStatuts: ComparateurConfig = {
	nomModèle: 'modele-social',
	contextes: [
		AssimiléSalariéContexte,
		AutoEntrepreneurContexteDansPublicodes,
		IndépendantContexte,
	],
	'objectifs exclusifs': [],
	objectifs: [
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . base . cotisée',
		'protection sociale . retraite . complémentaire . points acquis',
		'protection sociale . maladie . arrêt maladie',
		// 'protection sociale . maladie . arrêt maladie . délai de carence',
		// "protection sociale . maladie . arrêt maladie . délai d'attente",
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités',
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour',
		'protection sociale . maladie . maternité paternité adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel',
		'protection sociale . invalidité et décès . pension de reversion',
		'protection sociale . invalidité et décès . pension invalidité . invalidité partielle',
		'protection sociale . invalidité et décès . pension invalidité . invalidité totale',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . capital décès',
		'protection sociale . invalidité et décès . capital décès . orphelin',
		'entreprise . coût formalités . création',
	],
	questions: {
		'questions principales': [
			questionActivitéPrincipale,
			questionTypeActivité,
			questionActivitéRéglementée,
			questionAcre,
		],
		'groupes de questions': {
			activité: {
				titre: (t: TFunction) =>
					t(
						'pages.simulateurs.comparaison-statuts.questions.activité.titre',
						'Activité'
					),
				réponse: réponseActivité,
				liste: [
					questionActivitéPrincipale,
					questionTypeActivité,
					questionActivitéRéglementée,
				],
			},
			acre: {
				titre: (t: TFunction) =>
					t('pages.simulateurs.comparaison-statuts.questions.acre', 'Acre'),
				liste: [questionAcre],
			},
			TVA: {
				titre: (t: TFunction) =>
					t('pages.simulateurs.comparaison-statuts.questions.TVA.titre', 'TVA'),
				liste: [
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.TVA.libellé',
								'Entreprise assujettie à la TVA'
							),
						dottedName: 'entreprise . TVA',
					},
				],
			},
			impôt: {
				titre: (t: TFunction) =>
					t(
						'pages.simulateurs.comparaison-statuts.questions.impôt.méthode',
						'Méthode de calcul de l’impôt sur le revenu'
					),
				réponse: réponseImpôt,
				liste: [
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.impôt.méthode',
								'Méthode de calcul de l’impôt sur le revenu'
							),
						dottedName: 'impôt . méthode de calcul',
					},
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.impôt.taux',
								'Taux d’imposition'
							),
						dottedName: 'impôt . taux personnalisé',
					},
				],
			},
			foyerFiscal: {
				titre: (t: TFunction) =>
					t(
						'pages.simulateurs.comparaison-statuts.questions.foyer-fiscal.titre',
						'Foyer fiscal'
					),
				réponse: réponseFoyerFiscal,
				liste: [
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.foyer-fiscal.situation',
								'Situation de famille'
							),
						dottedName: 'impôt . foyer fiscal . situation de famille',
					},
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.foyer-fiscal.enfants',
								'Enfants à charge'
							),
						dottedName: 'impôt . foyer fiscal . enfants à charge',
					},
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.foyer-fiscal.parent-isolé',
								'Parent isolé'
							),
						dottedName: 'impôt . foyer fiscal . parent isolé',
					},
				],
			},
			autresRevenus: {
				titre: (t: TFunction) =>
					t(
						'pages.simulateurs.comparaison-statuts.questions.autres-revenus',
						'Autres revenus imposables'
					),
				liste: [
					{
						libellé: (t: TFunction) =>
							t(
								'pages.simulateurs.comparaison-statuts.questions.autres-revenus',
								'Autres revenus imposables'
							),
						dottedName:
							'impôt . foyer fiscal . revenu imposable . autres revenus imposables',
					},
				],
			},
		},
	},
	'unité par défaut': '€/mois',
	situation: {
		salarié: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . activité . revenus mixtes': 'non',
		'entreprise . date de création': "période . début d'année",
		"entreprise . chiffre d'affaires": '4000 €/mois',
		'entreprise . charges': '1000 €/mois',
		'entreprise . imposition': "'IR'",
	},
}
