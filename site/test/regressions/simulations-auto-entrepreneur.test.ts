import { expect, it } from 'vitest'

import { configAutoEntrepreneur } from '@/pages/Simulateurs/configs/autoEntrepreneur'

import autoEntrepreneurSituations from './simulations-auto-entrepreneur.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		autoEntrepreneurSituations,
		[
			...(configAutoEntrepreneur['objectifs exclusifs'] ?? []),
			...(configAutoEntrepreneur.objectifs ?? []),
		],
		configAutoEntrepreneur.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...configAutoEntrepreneur.situation,
					"dirigeant . auto-entrepreneur . chiffre d'affaires": '30000 €/an',
				})
				.evaluate('dirigeant . auto-entrepreneur . revenu net . après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . auto-entrepreneur . impôt . versement libératoire",
		  "entreprise . activité . nature",
		  "entreprise . activités . revenus mixtes",
		  "entreprise . activités . service ou vente",
		  "entreprise . date de création",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		]
	`)
})
