import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configMédecin } from '../profession-libérale/simulationConfig'
import { AvertissementMédecin } from './AvertissementMédecin'
import { Médecin } from './Médecin'
import { médecinMetadata } from './metadata'

export function médecinConfig(params: SimulatorsDataParams) {
	return config({
		...médecinMetadata(params),
		simulation: configMédecin,
		component: Médecin,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementMédecin,
	} as const)
}
