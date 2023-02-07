import { it } from 'vitest'

import { configDividendes } from '@/pages/Simulateurs/dividendes/dividendes'

import dividendesSituations from './simulations-dividendes.yaml'
import { runSimulations } from './utils'

it('calculate simulations-dividendes', () => {
	runSimulations(
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
