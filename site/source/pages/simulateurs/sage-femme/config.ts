import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configSageFemme } from '../profession-libérale/simulationConfig'
import { AvertissementSageFemme } from './AvertissementSageFemme'
import { sageFemmeMetadata } from './metadata'
import { SageFemme } from './SageFemme'

export function sageFemmeConfig(params: SimulatorsDataParams) {
	return config({
		...sageFemmeMetadata(params),
		simulation: configSageFemme,
		component: SageFemme,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementSageFemme,
	} as const)
}
