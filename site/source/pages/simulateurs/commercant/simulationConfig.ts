import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configCommerçant: PublicodesSimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . activité': "'commerciale'",
	},
}
