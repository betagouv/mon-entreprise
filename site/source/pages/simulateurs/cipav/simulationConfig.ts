import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configProfessionLibérale } from '../profession-liberale/simulationConfig'

export const cipavSimulationConfig: SimulationConfig = {
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'independant . profession libérale . réglementée . métier':
			"'rattaché Cipav'",
	},
}
