import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Indépendant } from './Indépendant'
import { indépendantMetadata } from './metadata'
import { configIndépendant } from './simulationConfig'

export function indépendantConfig(params: SimulatorsDataParams) {
	return config({
		...indépendantMetadata(params),
		simulation: configIndépendant,
		component: Indépendant,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
