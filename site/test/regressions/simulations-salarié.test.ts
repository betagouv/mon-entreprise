import { expect, it } from 'vitest'
import employeeConfig from '../../source/pages/Simulateurs/configs/salarié.yaml'
import employeeSituations from './simulations-salarié.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-salarié', () => {
	runSimulations(
		employeeSituations,
		employeeConfig.objectifs,
		employeeConfig.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...employeeConfig.situation,
					'salarié . contrat . salaire brut': '3000 €/mois',
				})
				.evaluate('salarié . rémunération . net après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "impôt . méthode de calcul",
		  "salarié . complémentaire santé . forfait",
		  "salarié . complémentaire santé . part employeur",
		  "salarié . contrat",
		  "salarié . contrat . temps de travail . temps partiel",
		  "salarié . convention collective",
		  "salarié . déduction forfaitaire spécifique",
		  "salarié . régime des impatriés",
		  "salarié . rémunération . avantages en nature",
		  "salarié . rémunération . frais professionnels . abonnement transports publics . montant",
		  "salarié . rémunération . frais professionnels . titres-restaurant",
		  "salarié . rémunération . frais professionnels . transports personnels . carburant faible émission . montant",
		  "salarié . rémunération . frais professionnels . transports personnels . forfait mobilités durables . montant",
		  "salarié . rémunération . primes . activité . base",
		  "salarié . rémunération . primes . fin d'année",
		  "salarié . statut cadre",
		  "salarié . temps de travail . heures supplémentaires",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . localisation",
		]
	`)
})
