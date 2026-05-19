import rules from 'modele-ae'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Le chiffre d’affaires', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour une seule activité', () => {
		const CA = 20_000

		it('vaut le CA vente restaurantion hébergement pour une activité commerciale de vente', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/an`,
				'entreprise . activité': "'commerciale'",
				'entreprise . activité . principale': "'vente'",
			})

			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . vente restauration hébergement",
				CA
			)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BIC",
				null
			)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BNC",
				null
			)
		})

		it('vaut le CA service BIC pour une activité commerciale de service', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/an`,
				'entreprise . activité': "'commerciale'",
				'entreprise . activité . principale': "'service'",
			})

			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . vente restauration hébergement",
				null
			)
			expect(e).toEvaluate("entreprise . chiffre d'affaires . service BIC", CA)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BNC",
				null
			)
		})

		it('vaut le CA vente restaurantion hébergement pour une activité artisanale de vente', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/an`,
				'entreprise . activité': "'artisanale'",
				'entreprise . activité . principale': "'vente'",
			})

			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . vente restauration hébergement",
				CA
			)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BIC",
				null
			)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BNC",
				null
			)
		})

		it('vaut le CA service BIC pour une activité artisanale de service', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/an`,
				'entreprise . activité': "'artisanale'",
				'entreprise . activité . principale': "'service'",
			})

			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . vente restauration hébergement",
				null
			)
			expect(e).toEvaluate("entreprise . chiffre d'affaires . service BIC", CA)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BNC",
				null
			)
		})

		it('vaut le CA service BNC pour une activité libérale', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/an`,
				'entreprise . activité': "'libérale'",
			})

			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . vente restauration hébergement",
				null
			)
			expect(e).toEvaluate(
				"entreprise . chiffre d'affaires . service BIC",
				null
			)
			expect(e).toEvaluate("entreprise . chiffre d'affaires . service BNC", CA)
		})
	})
})
