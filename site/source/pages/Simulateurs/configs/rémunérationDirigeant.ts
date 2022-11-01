import { SimulationConfig } from './types'

export const configRémunérationDirigeant: SimulationConfig = {
	// titre:
	// 	"Calcul du revenu du travailleur indépendant ou dirigeant d'entreprise après paiement des cotisations et de l'impôt sur le revenu.\n",
	'objectifs exclusifs': [],
	objectifs: [
		'dirigeant . rémunération . net',
		'entreprise . charges',
		'dirigeant . auto-entrepreneur . revenu net',

		// // pas utile ?
		// 'salarié . rémunération . net . à payer avant impôt',
		// 'protection sociale . retraite',
		// 'protection sociale . retraite . base . trimestres',
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
