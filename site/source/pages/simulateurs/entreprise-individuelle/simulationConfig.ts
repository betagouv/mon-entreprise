import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configEntrepriseIndividuelle: SimulationConfig = {
	...configIndépendant,
	situation: {
		'entreprise . EI': 'oui',
	},
}
