import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configEntrepriseIndividuelle: PublicodesSimulationConfig = {
	...configIndépendant,
	situation: {
		...configIndépendant.situation,
		'entreprise . EI': 'oui',
	},
}
