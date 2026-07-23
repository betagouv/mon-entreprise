import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AuxiliaireMédical } from './AuxiliaireMédical'
import { auxiliaireMédicalMetadata } from './metadata'

export function auxiliaireMédicalConfig(params: SimulatorsDataParams) {
	return config({
		...auxiliaireMédicalMetadata(params),
		component: AuxiliaireMédical,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
