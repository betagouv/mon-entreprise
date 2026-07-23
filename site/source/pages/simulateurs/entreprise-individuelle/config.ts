import { EntrepriseIndividuelle } from '@/pages/simulateurs/entreprise-individuelle/EntrepriseIndividuelle'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { entrepriseIndividuelleMetadata } from './metadata'

export function entrepriseIndividuelleConfig(params: SimulatorsDataParams) {
	return config({
		...entrepriseIndividuelleMetadata(params),
		component: EntrepriseIndividuelle,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
