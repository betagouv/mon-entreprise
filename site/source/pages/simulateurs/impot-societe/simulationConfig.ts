import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export const ISSimulationConfig: PublicodesSimulationConfig = {
	nomModèle: 'modele-social',
	'unité par défaut': '€/an',
	situation: {
		salarié: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': "'IS'",
		'entreprise . TVA . franchise de TVA': 'non',
	},
}
