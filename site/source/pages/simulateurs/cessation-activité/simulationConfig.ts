import { SimulationConfig } from '@/domaine/SimulationConfig'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'

export const configCessationActivité: SimulationConfig = {
	nomModèle: 'modele-ti',
	...configIndépendant,
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'indépendant . rémunération . totale',
		'indépendant . rémunération . nette',
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
		],
	},
	'règles à ignorer pour déclencher les questions': [
		'entreprise . date de cessation',
		'entreprise . imposition',
	],
}
