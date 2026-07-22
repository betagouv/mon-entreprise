import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ComparateurDeStatuts } from './ComparateurDeStatuts'
import { comparaisonStatutsMetadata } from './metadata'
import { configComparateurStatuts } from './simulationConfig'

export function comparaisonStatutsConfig(params: SimulatorsDataParams) {
	return config({
		...comparaisonStatutsMetadata(params),
		simulation: configComparateurStatuts,
		component: ComparateurDeStatuts,
	} as const)
}
