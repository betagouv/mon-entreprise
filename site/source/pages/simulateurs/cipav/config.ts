import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AvertissementCipav } from './AvertissementCipav'
import { Cipav } from './Cipav'
import { cipavMetadata } from './metadata'
import { cipavSimulationConfig } from './simulationConfig'

export function cipavConfig(params: SimulatorsDataParams) {
	return config({
		...cipavMetadata(params),
		simulation: cipavSimulationConfig,
		component: Cipav,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementCipav,
	} as const)
}
