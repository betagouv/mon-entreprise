import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AutoEntrepreneur } from './AutoEntrepreneur'
import { autoEntrepreneurMetadata } from './metadata'

export function autoEntrepreneurConfig(params: SimulatorsDataParams) {
	return config({
		...autoEntrepreneurMetadata(params),
		component: AutoEntrepreneur,
		conseillersEntreprisesVariant: 'micro_entrepreneur',
	} as const)
}
