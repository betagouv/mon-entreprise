import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configIndépendant: SimulationConfig = {
	nomModèle: 'modele-ti',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'indépendant . rémunération . totale',
		'indépendant . rémunération . nette',
		'indépendant . rémunération . nette . après impôt',
	],
	objectifs: ['indépendant . cotisations et contributions . début activité'],
	questions: {
		raccourcis: [
			{
				label: "Type d'activité",
				dottedName: 'entreprise . activité',
			},
			{
				label: 'Micro-fiscal',
				dottedName: 'entreprise . imposition . régime . micro-entreprise',
			},
			{
				label: 'Date de création',
				dottedName: 'entreprise . date de création',
			},
			{
				label: 'ACRE',
				dottedName:
					'indépendant . cotisations et contributions . cotisations . exonérations . ACRE',
			},
			{
				label: 'Contrats Madelins',
				dottedName: 'indépendant . cotisations facultatives',
			},
			{
				label: 'Conjoint collaborateur',
				dottedName: 'indépendant . conjoint collaborateur',
			},
			{
				label: 'Impôt sur le revenu',
				dottedName: 'impôt . méthode de calcul',
			},
		],
		'liste noire': [
			'entreprise . charges',
			"entreprise . chiffre d'affaires",
			'entreprise . exercice . début',
			'entreprise . exercice . fin',
			'entreprise . imposition . régime',
			'entreprise . imposition',
		],
		'non prioritaires': [
			'indépendant . cotisations facultatives',
			'entreprise . activité . saisonnière',
			'situation personnelle . RSA',
			'indépendant . PL . CNAVPL . exonération incapacité',
			'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité',
			'indépendant . cotisations et contributions . cotisations . exonérations . âge',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'indépendant . revenus étrangers',
			'indépendant . IJSS',
			'entreprise . activité . commerciale . débit de tabac',
			'indépendant . PL . PAMC . IJSS',
			'entreprise . salariés . effectif',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		'entreprise . imposition': "'IR'",
	},
	'règles à ignorer pour déclencher les questions': ['entreprise . imposition'],
}

export const configEntrepriseIndividuelle: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . EI': 'oui',
	},
}

export const configEirl: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . EI': 'oui',
	},
}

export const configEurl: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . EI': 'non',
	},
}
