import { it } from 'vitest'

import impotSocieteSituations from './simulations-impôt-société.yaml'
import { runSimulations } from './utils'

it('calculate simulations-impot-société', () => {
	runSimulations(
		impotSocieteSituations,
		[
			'entreprise . imposition . IS . montant',
			'entreprise . imposition . IS . contribution sociale',
		],
		{
			'entreprise . imposition': "'IS'",
			'entreprise . imposition . IS . éligible taux réduit': 'oui',
		}
	)
})
