import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { pharmacienMetadata } from './metadata'
import { Pharmacien } from './Pharmacien'

export function pharmacienConfig(params: SimulatorsDataParams) {
	return config({
		...pharmacienMetadata(params),
		component: Pharmacien,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
