import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { EURL } from './EURL'
import { eurlMetadata } from './metadata'

export function eurlConfig(params: SimulatorsDataParams) {
	return config({
		...eurlMetadata(params),
		component: EURL,
	} as const)
}
