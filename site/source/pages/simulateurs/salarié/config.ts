import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { salariéMetadata } from './metadata'
import SalariéSimulation from './Salarié'

export function salariéConfig(params: SimulatorsDataParams) {
	return config({
		...salariéMetadata(params),
		component: SalariéSimulation,
		conseillersEntreprisesVariant: 'recrutement',
	} as const)
}
