import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configExpertComptable } from '../profession-libérale/simulationConfig'
import { AvertissementExpertComptable } from './AvertissementExpertComptable'
import { ExpertComptable } from './ExpertComptable'
import { expertComptableMetadata } from './metadata'

export function expertComptableConfig(params: SimulatorsDataParams) {
	return config({
		...expertComptableMetadata(params),
		simulation: configExpertComptable,
		component: ExpertComptable,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementExpertComptable,
	} as const)
}
