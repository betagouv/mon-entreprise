import ISSimulation from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { impôtSociétéMetadata } from './metadata'

export function impôtSociétéConfig(params: SimulatorsDataParams) {
	return config({
		...impôtSociétéMetadata(params),
		component: ISSimulation,
	} as const)
}
