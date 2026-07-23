import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ArtisteAuteur } from './ArtisteAuteur'
import { artisteAuteurMetadata } from './metadata'

export function artisteAuteurConfig(params: SimulatorsDataParams) {
	return config({
		...artisteAuteurMetadata(params),
		component: ArtisteAuteur,
	} as const)
}
