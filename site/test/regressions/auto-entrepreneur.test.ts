import rules from 'modele-ae'
import { expect, it } from 'vitest'

import { engineFactory } from '@/utils/publicodes/engineFactory'

import autoEntrepreneurSituations from './auto-entrepreneur.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(engine, autoEntrepreneurSituations, [
		"entreprise . chiffre d'affaires",
		'auto-entrepreneur . revenu . net',
		'auto-entrepreneur . revenu . net . après impôt',
		'auto-entrepreneur . cotisations et contributions',
		'auto-entrepreneur . revenu . impôt',
		// ...(configAutoEntrepreneur['objectifs exclusifs'] ?? []),
		// ...(configAutoEntrepreneur.objectifs ?? []),
		"entreprise . chiffre d'affaires . vente restauration hébergement",
		"entreprise . chiffre d'affaires . service BIC",
		"entreprise . chiffre d'affaires . service BNC",
		'auto-entrepreneur . cotisations et contributions . CFP',
		'auto-entrepreneur . cotisations et contributions . TFC',
		'auto-entrepreneur . cotisations et contributions . cotisations',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BIC . taux',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BIC',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BNC . taux',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BNC',
		'auto-entrepreneur . cotisations et contributions . cotisations . vente restauration hébergement . taux',
		'auto-entrepreneur . cotisations et contributions . cotisations . vente restauration hébergement',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux',
		'auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav',
		'auto-entrepreneur . cotisations et contributions . cotisations . répartition . maladie-maternité',
		'auto-entrepreneur . cotisations et contributions . cotisations . répartition . invalidité-décès',
		'auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite de base',
		'auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite complémentaire',
		'auto-entrepreneur . cotisations et contributions . cotisations . répartition . autres contributions',
	])

	expect(
		getMissingVariables(
			engine
				.setSituation({
					"entreprise . chiffre d'affaires": '30000 €/an',
				})
				.evaluate('auto-entrepreneur . revenu . net . après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "auto-entrepreneur . versement libératoire",
		  "entreprise . activité",
		  "entreprise . activité . principale",
		  "entreprise . activité . revenus mixtes",
		  "entreprise . date de création",
		  "impôt . foyer fiscal . autres revenus imposables",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . situation de famille . question",
		  "impôt . méthode de calcul",
		  "paramètres . impôt . foyer fiscal . situation de famille",
		  "paramètres . impôt . revenu d'activité",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
