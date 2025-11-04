import { SimulationConfig } from '@/domaine/SimulationConfig'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'

export const configCessationActivité: SimulationConfig = {
	nomModèle: 'modele-social',
	...configIndépendant,
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . net',
	],
	'unité par défaut': '€/an',
	situation: {
		...configIndépendant.situation,
		"entreprise . en cessation d'activité": 'oui',
	},
	questions: {
		...configIndépendant.questions,
		'liste noire': [
			...(configIndépendant.questions?.['liste noire'] || []),
			'entreprise . date de cessation',
			'impôt', // Ce simulateur ignore le calcul de l’impôt
		],
	},
	'règles à ignorer pour déclencher les questions': [
		'entreprise . date de cessation',
		'entreprise . imposition',
	],
}
