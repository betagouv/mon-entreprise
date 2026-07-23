import ChoixDuStatut from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'
import { choixStatutJuridiqueMetadata } from './metadata'

export function choixStatutJuridiqueConfig(params: SimulatorsDataParams) {
	return config({
		...choixStatutJuridiqueMetadata(params),
		component: ChoixDuStatut,
	} as const)
}
