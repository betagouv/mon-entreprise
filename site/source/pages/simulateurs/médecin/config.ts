import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Médecin } from './Médecin'
import { médecinMetadata } from './metadata'

export function médecinConfig(params: SimulatorsDataParams) {
	return config({
		...médecinMetadata(params),
		component: Médecin,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
