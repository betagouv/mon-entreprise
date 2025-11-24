import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configProfessionLibérale } from '../profession-libérale/simulationConfig'

const cipavSimulationConfig: SimulationConfig = {
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'indépendant . PL . métier': "'rattaché CIPAV'",
	},
}

export default cipavSimulationConfig
