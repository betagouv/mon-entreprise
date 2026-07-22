import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configPharmacien } from '../profession-libérale/simulationConfig'
import { AvertissementPharmacien } from './AvertissementPharmacien'
import { pharmacienMetadata } from './metadata'
import { Pharmacien } from './Pharmacien'

export function pharmacienConfig(params: SimulatorsDataParams) {
	return config({
		...pharmacienMetadata(params),
		simulation: configPharmacien,
		component: Pharmacien,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementPharmacien,
	} as const)
}
