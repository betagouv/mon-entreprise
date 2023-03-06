import { expect, it } from 'vitest'

import { configSalarié } from '@/pages/simulateurs/salarié/simulationConfig'

import employeeSituations from './simulations-salarié.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-salarié', () => {
	runSimulations(
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
					'salarié . contrat . salaire brut': '3000 €/mois',
				})
				.evaluate('salarié . rémunération . net . payé après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "impôt . méthode de calcul",
		  "salarié . contrat",
		  "salarié . contrat . statut cadre",
		  "salarié . contrat . temps de travail . temps partiel",
		  "salarié . convention collective",
		  "salarié . cotisations . prévoyances . santé . montant",
		  "salarié . cotisations . prévoyances . santé . taux employeur",
		  "salarié . régimes spécifiques . DFS",
		  "salarié . régimes spécifiques . alsace moselle",
		  "salarié . régimes spécifiques . impatriés",
		  "salarié . rémunération . avantages en nature",
		  "salarié . rémunération . frais professionnels . titres-restaurant",
		  "salarié . rémunération . frais professionnels . trajets domicile travail . forfait mobilités durables . montant",
		  "salarié . rémunération . frais professionnels . trajets domicile travail . prime de transport . montant",
		  "salarié . rémunération . frais professionnels . trajets domicile travail . transports publics . montant",
		  "salarié . rémunération . primes . activité . base",
		  "salarié . rémunération . primes . fin d'année",
		  "salarié . temps de travail . heures supplémentaires",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
