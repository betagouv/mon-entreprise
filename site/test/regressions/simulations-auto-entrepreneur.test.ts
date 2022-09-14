import { expect, it } from 'vitest'
import autoentrepreneurConfig from '../../source/pages/Simulateurs/configs/auto-entrepreneur.yaml'
import autoEntrepreneurSituations from './simulations-auto-entrepreneur.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		autoEntrepreneurSituations,
		autoentrepreneurConfig.objectifs,
		autoentrepreneurConfig.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...autoentrepreneurConfig.situation,
					"dirigeant . auto-entrepreneur . chiffre d'affaires": '30000 €/an',
				})
				.evaluate('dirigeant . auto-entrepreneur . revenu net . après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . auto-entrepreneur . impôt . versement libératoire",
		  "entreprise . activité",
		  "entreprise . activité . mixte",
		  "entreprise . activité . service ou vente",
		  "entreprise . date de création",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		]
	`)
})
