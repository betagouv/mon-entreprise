import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { sageFemmeMetadata } from './metadata'
import { SageFemme } from './SageFemme'

export function sageFemmeConfig(params: SimulatorsDataParams) {
	return config({
		...sageFemmeMetadata(params),
		component: SageFemme,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
