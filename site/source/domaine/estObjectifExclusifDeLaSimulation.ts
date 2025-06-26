import { DottedName } from 'modele-social'

import { SimulationConfig } from '@/domaine/SimulationConfig'

export const estObjectifExclusifDeLaSimulation =
	(config: SimulationConfig) =>
	(question: DottedName): boolean =>
		config['objectifs exclusifs']?.includes(question) ?? false
