import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ExpertComptable } from './ExpertComptable'
import { expertComptableMetadata } from './metadata'

export function expertComptableConfig(params: SimulatorsDataParams) {
	return config({
		...expertComptableMetadata(params),
		component: ExpertComptable,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
