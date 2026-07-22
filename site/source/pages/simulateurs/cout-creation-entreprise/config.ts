import CoutCreationEntreprise from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { coûtCréationEntrepriseMetadata } from './metadata'
import { configCoûtCréationEntreprise } from './simulationConfig'

export function coûtCréationEntrepriseConfig(params: SimulatorsDataParams) {
	return config({
		...coûtCréationEntrepriseMetadata(params),
		simulation: configCoûtCréationEntreprise,
		component: CoutCreationEntreprise,
	} as const)
}
