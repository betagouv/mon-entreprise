import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { professionLibéraleMetadata } from './metadata'
import { ProfessionLibérale } from './ProfessionLibérale'

export function professionLibéraleConfig(params: SimulatorsDataParams) {
	return config({
		...professionLibéraleMetadata(params),
		component: ProfessionLibérale,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
