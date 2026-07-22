import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import SearchCodeApePage from '.'
import { SeoExplanations } from './components/SeoExplanations'
import { rechercheCodeApeMetadata } from './metadata'

export function rechercheCodeApeConfig(params: SimulatorsDataParams) {
	return config({
		...rechercheCodeApeMetadata(params),
		hideDate: true,
		component: SearchCodeApePage,
		seoExplanations: SeoExplanations,
	} as const)
}
