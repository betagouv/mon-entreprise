import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { EIRL } from './EIRL'
import { eirlMetadata } from './metadata'

export function eirlConfig(params: SimulatorsDataParams) {
	return config({
		...eirlMetadata(params),
		component: EIRL,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
