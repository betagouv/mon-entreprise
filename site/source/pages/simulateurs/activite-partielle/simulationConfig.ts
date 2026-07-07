import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configActivitéPartielle: SimulationConfig = {
	nomModèle: 'modele-social',
	objectifs: [
		'salarie . contrat . salaire brut',
		'salarie . rémunération . net . à payer avant impôt',
		'salarie . activité partielle . net habituel',
		'salarie . activité partielle . total employeur habituel',
		'salarie . coût total employeur',
	],
	questions: {
		liste: [
			'salarie . activité partielle',
			'salarie . temps de travail',
			'établissement . commune',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		dirigeant: 'non',
		'salarie . activité partielle': 'oui',
		'salarie . cotisations . prévoyances': {
			'applicable si': 'non',
		},
		'salarie . temps de travail . heures supplémentaires': 0,
		'salarie . temps de travail . heures complémentaires': 0,
	},
}
