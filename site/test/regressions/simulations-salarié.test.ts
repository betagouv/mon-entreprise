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
		  "contrat salarié . complémentaire santé . forfait",
		  "contrat salarié . complémentaire santé . part employeur",
		  "contrat salarié . convention collective",
		  "contrat salarié . déduction forfaitaire spécifique",
		  "contrat salarié . frais professionnels . abonnement transports publics . montant",
		  "contrat salarié . frais professionnels . titres-restaurant",
		  "contrat salarié . frais professionnels . transports personnels . carburant faible émission . montant",
		  "contrat salarié . frais professionnels . transports personnels . forfait mobilités durables . montant",
		  "contrat salarié . régime des impatriés",
		  "contrat salarié . rémunération . avantages en nature",
		  "contrat salarié . rémunération . primes . activité . base",
		  "contrat salarié . rémunération . primes . fin d'année . treizième mois",
		  "contrat salarié . statut cadre",
		  "contrat salarié . temps de travail . heures supplémentaires",
		  "contrat salarié . temps de travail . temps partiel",
		  "impôt . méthode de calcul",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . localisation",
		]
	`)
})
