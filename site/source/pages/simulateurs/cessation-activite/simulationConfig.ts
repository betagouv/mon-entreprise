import {
	QuestionsAutoGénérées,
	SimulationConfig,
} from '@/domaine/SimulationConfig'
import { configIndépendant } from '@/pages/simulateurs/independant/simulationConfig'

export const configCessationActivité: SimulationConfig = {
	nomModèle: 'modele-ti',
	...configIndépendant,
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'independant . rémunération . brute',
		'independant . rémunération . nette',
	],
	objectifs: [],
	situation: {
		...configIndépendant.situation,
		"entreprise . en cessation d'activité": 'oui',
	},
	questions: {
		...configIndépendant.questions,
		'liste noire': [
			...((configIndépendant.questions as QuestionsAutoGénérées)?.[
				'liste noire'
			] || []),
			'entreprise . date de cessation',
			'impôt', // Ce simulateur ignore le calcul de l’impôt
		],
	},
	'règles à ignorer pour déclencher les questions': [
		'entreprise . date de cessation',
		'entreprise . imposition',
	],
	'notifications à ignorer': ['entreprise . date de cessation . invalide'],
}
