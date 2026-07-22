import CMG from '@/pages/assistants/cmg'
import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import { CMGMetadata } from './metadata'

export function CMGConfig(params: SimulatorsDataParams) {
	return config({
		...CMGMetadata(params),
		disableIframeFeedback: true,
		component: CMG,
	} as const)
}
