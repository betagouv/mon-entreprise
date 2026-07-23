import PourMonEntreprise from '@/pages/assistants/pour-mon-entreprise'
import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import { pourMonEntrepriseMetadata } from './metadata'

export function pourMonEntrepriseConfig(params: SimulatorsDataParams) {
	return config({
		...pourMonEntrepriseMetadata(params),
		component: PourMonEntreprise,
	} as const)
}
