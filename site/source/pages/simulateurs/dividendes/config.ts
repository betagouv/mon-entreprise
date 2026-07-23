import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import DividendesSimulation from './Dividendes'
import { dividendesMetadata } from './metadata'

export function dividendesConfig(params: SimulatorsDataParams) {
	return config({
		...dividendesMetadata(params),
		component: DividendesSimulation,
	} as const)
}
