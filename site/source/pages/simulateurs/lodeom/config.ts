import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import LodeomSimulation from './Lodeom'
import { lodeomMetadata } from './metadata'

export function lodeomConfig(params: SimulatorsDataParams) {
	return config({
		...lodeomMetadata(params),
		component: LodeomSimulation,
	} as const)
}
