import { SimulationConfig } from './types'

export const configComparateurStatuts: SimulationConfig = {
	'objectifs exclusifs': [],
	objectifs: [
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . base',
		'protection sociale . retraite . complémentaire',
		'protection sociale . maladie . arrêt maladie',
		'protection sociale . maladie . arrêt maladie . délai de carence',
		"protection sociale . maladie . arrêt maladie . délai d'attente",
	],
	questions: {
		'liste noire': [
			'entreprise . charges',
			"entreprise . chiffre d'affaires",
			'entreprise . activité . nature . libérale . réglementée',
			'entreprise . imposition',
			'entreprise . imposition . régime',
			'entreprise . imposition . régime . micro-entreprise',
			'entreprise . salariés . effectif . seuil',
			'salarié . rémunération . avantages en nature',
		],
		liste: [
			'entreprise . activité',
			'dirigeant . exonérations . ACRE',
			'impôt',
			'entreprise . TVA',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		'entreprise . activités . revenus mixtes': 'non',
		salarié: 'non',
		'salarié . cotisations . ATMP . taux fonctions support': 'oui',
		"entreprise . chiffre d'affaires": '4000 €/mois',
		'entreprise . charges': '1000 €/mois',
		'entreprise . date de création': "période . début d'année",
		'dirigeant . exonérations . ACRE': 'non',
	},
}
