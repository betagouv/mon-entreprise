import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configIndépendant: SimulationConfig = {
	nomModèle: 'modele-ti',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'independant . rémunération . brute',
		'independant . rémunération . nette',
		'independant . rémunération . nette . avec dividendes',
		'independant . rémunération . nette . après impôt',
	],
	objectifs: [
		'independant . cotisations et contributions',
		'independant . cotisations et contributions . avec dividendes',
		'independant . cotisations et contributions . début activité',
		'independant . rémunération . impôt',
		'independant . rémunération . impôt . avec dividendes',
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
					'independant . cotisations et contributions . cotisations . exonérations . Acre',
			},
			{
				label: 'Contrats Madelins',
				dottedName:
					'independant . cotisations et contributions . cotisations facultatives',
			},
			{
				label: 'Conjoint collaborateur',
				dottedName: 'independant . conjoint collaborateur',
			},
			{
				label: 'Impôt sur le revenu',
				dottedName: 'impôt . méthode de calcul',
			},
			{
				label: 'Imposition des dividendes',
				dottedName: 'independant . dividendes . imposition',
			},
		],
		'liste noire': [
			'entreprise . imposition',
			"entreprise . chiffre d'affaires",
			'entreprise . charges',
			'independant . rémunération . brute',
			'independant . rémunération . nette',
			'independant . rémunération . nette . avec dividendes',
			'independant . rémunération . nette . après impôt',
			'independant . dividendes',
		],
		'non prioritaires': [
			'entreprise . activité . commerciale . débit de tabac',
			'independant . profession libérale . CNAVPL . exonération incapacité',
			'independant . cotisations et contributions . cotisations . exonérations . invalidité',
			'independant . cotisations et contributions . cotisations . exonérations . âge',
			'independant . cotisations et contributions . cotisations facultatives',
			'independant . revenus de remplacement',
			'independant . revenus étrangers',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'entreprise . salaries . effectif',
			'situation personnelle . RSA',
			'entreprise . activité . saisonnière',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		'entreprise . imposition': "'IR'",
	},
	'règles à ignorer pour déclencher les questions': ['entreprise . imposition'],
}
