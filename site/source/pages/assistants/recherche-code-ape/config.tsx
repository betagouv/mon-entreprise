import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import SearchCodeApePage from '.'
import { rechercheCodeApeMetadata } from './metadata'

export function rechercheCodeApeConfig(params: SimulatorsDataParams) {
	return config({
		...rechercheCodeApeMetadata(params),
		component: SearchCodeApePage,
	} as const)
}
