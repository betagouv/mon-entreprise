import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configEurl: SimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . EI': 'non',
	},
}
