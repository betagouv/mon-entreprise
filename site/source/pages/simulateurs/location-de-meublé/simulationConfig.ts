import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configLocationDeMeublé: SimulationConfig = {
	'objectifs exclusifs': [
		'location de logement meublé . courte durée . recettes',
	],
	objectifs: ['location de logement meublé . cotisations'],
	'unité par défaut': '€/an',
	questions: {
		liste: ['location de logement meublé . affiliation', ''],
	},
	situation: {
		'entreprise . activité . nature': "'commerciale'",
	},
}
