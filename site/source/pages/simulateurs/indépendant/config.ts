import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Indépendant } from './Indépendant'
import { indépendantMetadata } from './metadata'

export function indépendantConfig(params: SimulatorsDataParams) {
	return config({
		...indépendantMetadata(params),
		component: Indépendant,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
