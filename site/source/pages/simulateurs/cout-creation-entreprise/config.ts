import CoutCreationEntreprise from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { coûtCréationEntrepriseMetadata } from './metadata'

export function coûtCréationEntrepriseConfig(params: SimulatorsDataParams) {
	return config({
		...coûtCréationEntrepriseMetadata(params),
		component: CoutCreationEntreprise,
	} as const)
}
