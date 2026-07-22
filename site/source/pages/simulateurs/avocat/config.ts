import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configAvocat } from '../profession-libérale/simulationConfig'
import { AvertissementAvocat } from './AvertissementAvocat'
import { Avocat } from './Avocat'
import { avocatMetadata } from './metadata'

export function avocatConfig(params: SimulatorsDataParams) {
	return config({
		...avocatMetadata(params),
		simulation: configAvocat,
		component: Avocat,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementAvocat,
	} as const)
}
