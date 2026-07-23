import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Avocat } from './Avocat'
import { avocatMetadata } from './metadata'

export function avocatConfig(params: SimulatorsDataParams) {
	return config({
		...avocatMetadata(params),
		component: Avocat,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
