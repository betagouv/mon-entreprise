import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import LocationDeMeublé from '@/pages/simulateurs/location-de-meublé/LocationDeMeublé'

import { locationDeMeubleMetadata } from './metadata'

export function locationDeMeubleConfig(params: SimulatorsDataParams) {
	return config({
		...locationDeMeubleMetadata(params),
		component: LocationDeMeublé,
	} as const)
}
