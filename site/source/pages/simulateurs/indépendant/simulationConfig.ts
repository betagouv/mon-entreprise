import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configIndépendant: SimulationConfig = {
	nomModèle: 'modele-ti',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'indépendant . rémunération . brute',
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
				dottedName: 'entreprise . imposition . IR . régime micro-fiscal',
			},
			{
				label: 'Date de création',
				dottedName: 'entreprise . date de création',
			},
			{
				label: 'Acre',
				dottedName:
					'indépendant . cotisations et contributions . cotisations . exonérations . Acre',
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
			{
				label: 'Imposition des dividendes',
				dottedName: 'indépendant . dividendes . imposition',
			},
		],
		liste: [
			'entreprise . capital social',
			"entreprise . bénéfice net de l'exercice précédent",
			'',
		],
		'liste noire': [
			"entreprise . chiffre d'affaires",
			'entreprise . charges',
			'entreprise . imposition',
		],
		'non prioritaires': [
			'indépendant . cotisations facultatives',
			'entreprise . activité . saisonnière',
			'situation personnelle . RSA',
			'indépendant . profession libérale . CNAVPL . exonération incapacité',
			'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité',
			'indépendant . cotisations et contributions . cotisations . exonérations . âge',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'indépendant . revenus étrangers',
			'indépendant . IJSS',
			'entreprise . activité . commerciale . débit de tabac',
			'indépendant . profession libérale . réglementée . PAMC . IJSS',
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
