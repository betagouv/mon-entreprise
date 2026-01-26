import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configEirl: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . EI': 'oui',
	},
}
