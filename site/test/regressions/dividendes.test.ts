import rules from 'modele-social'
import { it } from 'vitest'

import { configDividendes } from '@/pages/simulateurs/dividendes/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import dividendesSituations from './dividendes.yaml'
import { runSimulations } from './utils'

it('calculate simulations-dividendes', () => {
	runSimulations(
		engineFactory(rules),
		dividendesSituations,
		[
			...(configDividendes['objectifs exclusifs'] ?? []),
			...(configDividendes.objectifs ?? []),
			'bénéficiaire . dividendes . cotisations et contributions',
			'impôt . montant',
			'impôt . revenu imposable',
			'bénéficiaire . dividendes . imposables',
			"impôt . taux d'imposition",
		],
		configDividendes.situation
	)
})
