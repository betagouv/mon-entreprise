import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configDentiste } from '../profession-libérale/simulationConfig'
import { AvertissementChirurgienDentiste } from './AvertissementChirurgienDentiste'
import { ChirurgienDentiste } from './ChirurgienDentiste'
import { chirurgienDentisteMetadata } from './metadata'

export function chirurgienDentisteConfig(params: SimulatorsDataParams) {
	return config({
		...chirurgienDentisteMetadata(params),
		simulation: configDentiste,
		component: ChirurgienDentiste,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementChirurgienDentiste,
	} as const)
}
