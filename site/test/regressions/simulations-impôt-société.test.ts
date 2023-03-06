import { it } from 'vitest'

import ISSimulationConfig from '@/pages/simulateurs/impot-societe/simulationConfig'

import impotSocieteSituations from './simulations-impôt-société.yaml'
import { runSimulations } from './utils'

it('calculate simulations-impot-société', () => {
	runSimulations(
		impotSocieteSituations,
		[
			'entreprise . imposition . IS . montant',
			'entreprise . imposition . IS . contribution sociale',
		],
		ISSimulationConfig.situation
	)
})
