import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configIndépendant: SimulationConfig = {
	nomModèle: 'modele-ti',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'indépendant . rémunération . brute',
		'indépendant . rémunération . nette',
		'indépendant . rémunération . nette . avec dividendes',
		'indépendant . rémunération . nette . après impôt',
	],
	objectifs: [
		'indépendant . cotisations et contributions',
		'indépendant . cotisations et contributions . avec dividendes',
		'indépendant . cotisations et contributions . début activité',
		'indépendant . rémunération . impôt',
		'indépendant . rémunération . impôt . avec dividendes',
		'protection sociale . retraite . base . trimestres',
		'protection sociale . retraite . complémentaire',
		'protection sociale . retraite . base',
	],
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
