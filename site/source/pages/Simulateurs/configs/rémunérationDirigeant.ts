import { SimulationConfig } from './types'

export const configRémunérationDirigeant: SimulationConfig = {
	'objectifs exclusifs': [],
	objectifs: [
		'dirigeant . rémunération . net',
		'entreprise . charges',
		'dirigeant . auto-entrepreneur . revenu net',
		'protection sociale . santé . indemnités journalières',
	],
	questions: {
		'liste noire': [
			'entreprise . charges',
			'entreprise . activité . nature . libérale . réglementée',
		],
		liste: ['entreprise . activité . nature'],
	},
	'unité par défaut': '€/an',
	situation: {
		'entreprise . activité . mixte': 'non',
		'salarié . cotisations . ATMP . taux fonctions support': 'oui',
	},
}
