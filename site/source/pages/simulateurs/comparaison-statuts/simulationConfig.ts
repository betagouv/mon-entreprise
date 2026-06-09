import { TFunction } from 'i18next'

import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { ComparateurConfig } from '@/domaine/ComparateurConfig'
import { IndépendantContexte } from '@/domaine/IndépendantContexte'
import { AutoEntrepreneurContexteDansPublicodes } from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

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
		'entreprise . activité . nature . libérale . réglementée',
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . complémentaire',
		'protection sociale . maladie . arrêt maladie',
		'protection sociale . maladie . arrêt maladie . délai de carence',
		"protection sociale . maladie . arrêt maladie . délai d'attente",
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités',
		'protection sociale . maladie . maternité paternité adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel',
		'protection sociale . invalidité et décès . pension de reversion',
		'protection sociale . invalidité et décès . pension invalidité . invalidité partielle',
		'protection sociale . invalidité et décès . pension invalidité . invalidité totale',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . capital décès',
		'protection sociale . invalidité et décès . capital décès . orphelin',
	],
	questions: {
		activité: {
			titre: (t: TFunction) =>
				t(
					'pages.simulateurs.comparaison-statuts.questions.activité.titre',
					'Activité'
				),
			liste: [
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.activité.principale',
							'Activité principale'
						),
					dottedName: 'entreprise . activité . nature',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.activité.type',
							'Type d’activité'
						),
					dottedName: 'entreprise . activités . service ou vente',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.activité.réglementée',
							'Activité réglementée'
						),
					dottedName: 'entreprise . activité . nature . libérale . réglementée',
				},
			],
		},
		acre: {
			titre: (t: TFunction) =>
				t('pages.simulateurs.comparaison-statuts.questions.acre.titre', 'Acre'),
			liste: [
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.acre.libellé',
							'Acre'
						),
					dottedName: 'dirigeant . exonérations . ACRE',
				},
			],
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
					'pages.simulateurs.comparaison-statuts.questions.impôt.titre',
					'Impôt'
				),
			liste: [
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.méthode',
							'Méthode de calcul'
						),
					dottedName: 'impôt . méthode de calcul',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.taux',
							'Taux personnalisé'
						),
					dottedName: 'impôt . taux personnalisé',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.situation',
							'Situation de famille'
						),
					dottedName: 'impôt . foyer fiscal . situation de famille',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.enfants',
							'Enfants à charge'
						),
					dottedName: 'impôt . foyer fiscal . enfants à charge',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.parent-isolé',
							'Parent isolé'
						),
					dottedName: 'impôt . foyer fiscal . parent isolé',
				},
				{
					libellé: (t: TFunction) =>
						t(
							'pages.simulateurs.comparaison-statuts.questions.impôt.revenus',
							'Autres revenus imposables'
						),
					dottedName:
						'impôt . foyer fiscal . revenu imposable . autres revenus imposables',
				},
			],
		},
	},
	'unité par défaut': '€/mois',
	situation: {
		'entreprise . catégorie juridique': "''",
		salarié: 'non',
		'salarié . cotisations . ATMP . taux fonctions support': 'oui',
		"entreprise . chiffre d'affaires": '4000 €/mois',
		'entreprise . charges': '1000 €/mois',
		'entreprise . date de création': "période . début d'année",
	},
}
