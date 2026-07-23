import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ChirurgienDentiste } from './ChirurgienDentiste'
import { chirurgienDentisteMetadata } from './metadata'

export function chirurgienDentisteConfig(params: SimulatorsDataParams) {
	return config({
		...chirurgienDentisteMetadata(params),
		component: ChirurgienDentiste,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
