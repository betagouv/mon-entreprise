import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../independant/simulationConfig'

export const configEurl: SimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . EI': 'non',
	},
}
