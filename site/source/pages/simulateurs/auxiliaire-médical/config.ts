import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configAuxiliaire } from '../profession-libérale/simulationConfig'
import { AuxiliaireMédical } from './AuxiliaireMédical'
import { AvertissementAuxiliaireMédical } from './AvertissementAuxiliaireMédical'
import { auxiliaireMédicalMetadata } from './metadata'

export function auxiliaireMédicalConfig(params: SimulatorsDataParams) {
	return config({
		...auxiliaireMédicalMetadata(params),
		simulation: configAuxiliaire,
		component: AuxiliaireMédical,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementAuxiliaireMédical,
	} as const)
}
