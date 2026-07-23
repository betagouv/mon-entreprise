import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

import { configProfessionLibérale } from '../profession-libérale/simulationConfig'

export const cipavSimulationConfig: PublicodesSimulationConfig = {
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'indépendant . profession libérale . réglementée . métier':
			"'rattaché Cipav'",
	},
}
