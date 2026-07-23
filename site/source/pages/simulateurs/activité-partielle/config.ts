import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ActivitéPartielle } from './ActivitéPartielle'
import { activitéPartielleMetadata } from './metadata'

export function activitéPartielleConfig(params: SimulatorsDataParams) {
	return config({
		...activitéPartielleMetadata(params),
		component: ActivitéPartielle,
		conseillersEntreprisesVariant: 'activite_partielle',
	} as const)
}
