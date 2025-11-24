import rules from 'modele-social'
import { expect, it } from 'vitest'

import { configAutoEntrepreneur } from '@/pages/simulateurs/auto-entrepreneur/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import autoEntrepreneurSituations from './auto-entrepreneur.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		engine,
		autoEntrepreneurSituations,
		[
			...(configAutoEntrepreneur['objectifs exclusifs'] ?? []),
			...(configAutoEntrepreneur.objectifs ?? []),
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BIC . taux',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BIC',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . vente restauration hébergement . taux',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . vente restauration hébergement',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite de base',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite complémentaire',
			'dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions',
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
		  "entreprise . activité . revenus mixtes",
		  "entreprise . activités . service ou vente",
		  "entreprise . date de création",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
