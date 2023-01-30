import { SimulationConfig } from './types'

export const configIndépendant: SimulationConfig = {
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
	],
	questions: {
		"à l'affiche": [
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
			'entreprise . catégorie juridique',
			'entreprise . imposition . régime',
			'entreprise . activités',
			'entreprise . activités . revenus mixtes',
		],
		'non prioritaires': [
			'dirigeant . indépendant . cotisations facultatives',
			'dirigeant . indépendant . IJSS',
			'dirigeant . indépendant . PL . PAMC . IJSS',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
			'entreprise . salariés . effectif',
			'entreprise . activités . commerciale . débit de tabac',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		'dirigeant . régime social': "'indépendant'",
		'entreprise . imposition': "'IR'",
		salarié: 'non',
	},
}

export const configEntrepriseIndividuelle: SimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . imposition': "'IR'",
	},
}

export const configEirl: SimulationConfig = {
	...configIndépendant,
}

export const configEurl: SimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . imposition': "'IS'",
	},
}
