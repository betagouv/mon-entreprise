import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { pamcMetadata } from './metadata'
import { PAMCHome } from './PAMCHome'

export function pamcConfig(params: SimulatorsDataParams) {
	return config({
		...pamcMetadata(params),
		component: PAMCHome,
	} as const)
}
