import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'
import { cotisationMaladieFrontalierSuisseMetadata } from './metadata'

export function cotisationMaladieFrontalierSuisseConfig(
	params: SimulatorsDataParams
) {
	return config({
		...cotisationMaladieFrontalierSuisseMetadata(params),
		component: CotisationMaladieFrontalierSuisse,
	} as const)
}
