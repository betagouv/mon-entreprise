import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Cipav } from './Cipav'
import { cipavMetadata } from './metadata'

export function cipavConfig(params: SimulatorsDataParams) {
	return config({
		...cipavMetadata(params),
		component: Cipav,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
