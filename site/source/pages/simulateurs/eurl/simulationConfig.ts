import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configEurl: PublicodesSimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . EI': 'non',
	},
}
