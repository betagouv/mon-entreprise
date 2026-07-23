import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ComparateurDeStatuts } from './ComparateurDeStatuts'
import { comparaisonStatutsMetadata } from './metadata'

export function comparaisonStatutsConfig(params: SimulatorsDataParams) {
	return config({
		...comparaisonStatutsMetadata(params),
		component: ComparateurDeStatuts,
	} as const)
}
