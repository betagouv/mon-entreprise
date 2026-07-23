import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activité/CessationActivité'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { cessationActivitéMetadata } from './metadata'

export function cessationActivitéConfig(params: SimulatorsDataParams) {
	return config({
		...cessationActivitéMetadata(params),
		component: CessationActivitéSimulation,
	} as const)
}
