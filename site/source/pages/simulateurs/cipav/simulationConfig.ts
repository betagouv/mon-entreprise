import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configProfessionLibérale } from '../profession-libérale/simulationConfig'

export const cipavSimulationConfig: SimulationConfig = {
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'indépendant . profession libérale . réglementée . métier':
			"'rattaché CIPAV'",
	},
}
