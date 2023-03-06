import { SimulationConfig } from '../_configs/types'

export const configChômagePartiel: SimulationConfig = {
	objectifs: [
		'salarié . contrat . salaire brut',
		'salarié . rémunération . net . à payer avant impôt',
		'salarié . activité partielle . net habituel',
		'salarié . activité partielle . total employeur habituel',
		'salarié . coût total employeur',
	],
	questions: {
		liste: [
			'salarié . activité partielle',
			'salarié . temps de travail',
			'établissement . commune',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		dirigeant: 'non',
		'salarié . activité partielle': 'oui',
		'salarié . cotisations . prévoyances': {
			'applicable si': 'non',
		},
	},
}
