import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { sasuMetadata } from './metadata'
import { SASUSimulation } from './SASU'

export function sasuConfig(params: SimulatorsDataParams) {
	return config({
		...sasuMetadata(params),
		component: SASUSimulation,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
