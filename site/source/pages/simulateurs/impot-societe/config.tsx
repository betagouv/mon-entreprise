import ISSimulation, { SeoExplanations } from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { impôtSociétéMetadata } from './metadata'
import { ISSimulationConfig } from './simulationConfig'

export function impôtSociétéConfig(params: SimulatorsDataParams) {
	return config({
		...impôtSociétéMetadata(params),
		hideDate: true,
		component: ISSimulation,
		seoExplanations: SeoExplanations,
		simulation: ISSimulationConfig,
	} as const)
}
