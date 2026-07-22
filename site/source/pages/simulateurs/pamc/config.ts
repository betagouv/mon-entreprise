import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configProfessionLibérale } from '../profession-libérale/simulationConfig'
import { pamcMetadata } from './metadata'
import { PAMCHome } from './PAMCHome'

export function pamcConfig(params: SimulatorsDataParams) {
	return config({
		...pamcMetadata(params),
		simulation: configProfessionLibérale,
		component: PAMCHome,
	} as const)
}
