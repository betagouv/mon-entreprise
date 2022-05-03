import { it } from 'vitest'
import dividendesConfig from '../../source/pages/Simulateurs/configs/dividendes.yaml'
import dividendesSituations from './simulations-dividendes.yaml'
import { runSimulations } from './utils'

it('calculate simulations-dividendes', () => {
	runSimulations(
		dividendesSituations,
		[
			...dividendesConfig.objectifs,
			'bénéficiaire . dividendes . cotisations et contributions',
			'impôt . montant',
			'impôt . revenu imposable',
			'bénéficiaire . dividendes . imposables',
			"impôt . taux d'imposition",
		],
		dividendesConfig.situation
	)
})
