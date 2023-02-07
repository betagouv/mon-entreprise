import { expect, it } from 'vitest'

import { configArtisteAuteur } from '@/pages/Simulateurs/artiste-auteur/artisteAuteur'

import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		[
			...(configArtisteAuteur['objectifs exclusifs'] ?? []),
			...(configArtisteAuteur.objectifs ?? []),
		],
		configArtisteAuteur.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation(configArtisteAuteur.situation)
				.evaluate('artiste-auteur . cotisations')
		)
	).toMatchInlineSnapshot(`
		[
		  "artiste-auteur . revenus . BNC . recettes",
		  "artiste-auteur . revenus . traitements et salaires",
		  "salarié . contrat",
		  "salarié . régimes spécifiques . DFS",
		]
	`)
})
