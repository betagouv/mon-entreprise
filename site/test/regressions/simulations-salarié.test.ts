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
					'contrat salarié . rémunération . brut de base': '3000 €/mois',
				})
				.evaluate('contrat salarié . rémunération . net après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "contrat salarié",
		  "contrat salarié . convention collective",
		  "contrat salarié . temps de travail . temps partiel",
		  "contrat salarié . rémunération . primes . activité . base",
		  "contrat salarié . temps de travail . heures supplémentaires",
		  "contrat salarié . frais professionnels . abonnement transports publics . montant",
		  "contrat salarié . frais professionnels . transports personnels . carburant faible émission . montant",
		  "contrat salarié . déduction forfaitaire spécifique",
		  "contrat salarié . frais professionnels . titres-restaurant",
		  "contrat salarié . frais professionnels . transports personnels . forfait mobilités durables . montant",
		  "contrat salarié . rémunération . avantages en nature",
		  "contrat salarié . rémunération . primes . fin d'année . treizième mois",
		  "contrat salarié . complémentaire santé . forfait",
		  "contrat salarié . complémentaire santé . part employeur",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "contrat salarié . statut cadre",
		  "contrat salarié . régime des impatriés",
		  "établissement . localisation",
		  "impôt . méthode de calcul",
		]
	`)
})
