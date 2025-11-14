import rules from 'modele-social'
import { it } from 'vitest'

import ISSimulationConfig from '@/pages/simulateurs/impot-societe/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import impotSocieteSituations from './impôt-société.yaml'
import { runSimulations } from './utils'

it('calculate simulations-impot-société', () => {
	runSimulations(
		engineFactory(rules),
		impotSocieteSituations,
		[
			'entreprise . imposition . IS . montant',
			'entreprise . imposition . IS . contribution sociale',
		],
		ISSimulationConfig.situation
	)
})
