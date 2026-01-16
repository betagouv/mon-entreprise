import { SimulationConfig } from '@/domaine/SimulationConfig'

export const ISSimulationConfig: SimulationConfig = {
	nomModèle: 'modele-social',
	'unité par défaut': '€/an',
	situation: {
		salarié: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': "'IS'",
		'entreprise . TVA . franchise de TVA': 'non',
	},
}
