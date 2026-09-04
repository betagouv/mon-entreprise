import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configArtisan: PublicodesSimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . activité': "'artisanale'",
	},
}
