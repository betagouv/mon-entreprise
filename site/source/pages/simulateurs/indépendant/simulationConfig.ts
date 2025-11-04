import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configIndépendant: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
	],
	objectifs: [
		'dirigeant . indépendant . cotisations et contributions . début activité',
	],
	questions: {
		raccourcis: [
			{
				label: "Type d'activité",
				dottedName: 'entreprise . activité . nature',
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
				dottedName: 'dirigeant . exonérations . ACRE',
			},
			{
				label: 'Contrats Madelins',
				dottedName: 'dirigeant . indépendant . cotisations facultatives',
			},
			{
				label: 'Conjoint collaborateur',
				dottedName: 'dirigeant . indépendant . conjoint collaborateur',
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
			'entreprise . activités',
			'entreprise . activités . revenus mixtes',
		],
		'non prioritaires': [
			'dirigeant . indépendant . cotisations facultatives',
			'entreprise . activités . saisonnière',
			'situation personnelle . RSA',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
			'dirigeant . indépendant . cotisations et contributions . exonérations . âge',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'dirigeant . indépendant . revenus étrangers',
			'dirigeant . indépendant . IJSS',
			'entreprise . activités . commerciale . débit de tabac',
			'dirigeant . indépendant . PL . PAMC . IJSS',
			'entreprise . salariés . effectif',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		'dirigeant . régime social': "'indépendant'",
		'entreprise . imposition': "'IR'",
		'entreprise . catégorie juridique': "''",
		salarié: 'non',
	},
	'règles à ignorer pour déclencher les questions': ['entreprise . imposition'],
}

export const configEntrepriseIndividuelle: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
	},
}

export const configEirl: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
	},
}

export const configEurl: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . catégorie juridique': "'SARL'",
		'entreprise . associés': "'unique'",
		'entreprise . imposition': "'IS'",
	},
}
