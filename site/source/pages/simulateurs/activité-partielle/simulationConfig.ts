import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configActivitéPartielle: SimulationConfig = {
	nomModèle: 'modele-social',
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
		'salarié . temps de travail . heures supplémentaires': 0,
		'salarié . temps de travail . heures complémentaires': 0,
	},
}
