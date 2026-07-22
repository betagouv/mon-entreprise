import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import LodeomSimulation from './Lodeom'
import { lodeomMetadata } from './metadata'
import { configLodeom } from './simulationConfig'

export function lodeomConfig(params: SimulatorsDataParams) {
	return config({
		...lodeomMetadata(params),
		simulation: configLodeom,
		component: LodeomSimulation,
	} as const)
}
