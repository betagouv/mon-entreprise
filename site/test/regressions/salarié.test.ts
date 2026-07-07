import rules from 'modele-social'
import { expect, it } from 'vitest'

import { configSalarié } from '@/pages/simulateurs/salarie/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import employeeSituations from './salarie.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-salarie', () => {
	runSimulations(
		engine,
		employeeSituations,
		[
			...(configSalarié['objectifs exclusifs'] ?? []),
			...(configSalarié.objectifs ?? []),
		],
		configSalarié.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...configSalarié.situation,
					'salarie . contrat . salaire brut': '3000 €/mois',
				})
				.evaluate('salarie . rémunération . net . payé après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "impôt . méthode de calcul",
		  "salarie . contrat",
		  "salarie . contrat . statut cadre",
		  "salarie . contrat . temps de travail . temps partiel",
		  "salarie . convention collective",
		  "salarie . cotisations . prévoyances . santé . montant",
		  "salarie . cotisations . prévoyances . santé . taux employeur",
		  "salarie . régimes spécifiques . DFS",
		  "salarie . régimes spécifiques . alsace moselle",
		  "salarie . régimes spécifiques . impatriés",
		  "salarie . régimes spécifiques . taux réduits",
		  "salarie . rémunération . avantages en nature",
		  "salarie . rémunération . frais professionnels . titres-restaurant",
		  "salarie . rémunération . frais professionnels . trajets domicile travail . forfait mobilités durables . montant",
		  "salarie . rémunération . frais professionnels . trajets domicile travail . prime de transport . montant",
		  "salarie . rémunération . frais professionnels . trajets domicile travail . transports publics . montant",
		  "salarie . rémunération . primes . activité . base",
		  "salarie . rémunération . primes . fin d'année",
		  "salarie . temps de travail . heures supplémentaires",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
