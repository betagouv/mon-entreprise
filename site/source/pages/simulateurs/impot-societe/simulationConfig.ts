import { SimulationConfig } from '@/domaine/SimulationConfig'

const ISSimulationConfig: SimulationConfig = {
	'unité par défaut': '€/an',
	situation: {
		salarié: 'non',
		'entreprise . imposition': "'IS'",
		'entreprise . imposition . IS . éligible taux réduit': 'oui',
		'entreprise . TVA . franchise de TVA': 'non',
	},
}

export default ISSimulationConfig
