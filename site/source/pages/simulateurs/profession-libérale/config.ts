import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AvertissementProfessionLibérale } from './AvertissementProfessionLibérale'
import { professionLibéraleMetadata } from './metadata'
import { ProfessionLibérale } from './ProfessionLibérale'
import { configProfessionLibérale } from './simulationConfig'

export function professionLibéraleConfig(params: SimulatorsDataParams) {
	return config({
		...professionLibéraleMetadata(params),
		simulation: configProfessionLibérale,
		component: ProfessionLibérale,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementProfessionLibérale,
	} as const)
}
