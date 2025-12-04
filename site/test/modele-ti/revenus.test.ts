import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Indépendant', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('à l’IR', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IR'",
			'entreprise . charges': '10000 €/an',
		}

		describe('à partir du chiffre d’affaires', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": '50000 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27714)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": '50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					25875
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27714 €/an',
				})

				expect(e).toEvaluate("entreprise . chiffre d'affaires", 50000)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27714 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					25875
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '25875 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27714)
			})
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '25875 €/an',
				})

				expect(e).toEvaluate("entreprise . chiffre d'affaires", 50001)
			})
		})
	})

	describe('à l’IS', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IS'",
		}

		describe('à partir de la rémunération totale', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . totale': '40000 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27714)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . totale': '40000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					26331
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27714 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . totale', 40000)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27714 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					26331
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '26331 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27714)
			})
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '26331 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . totale', 40000)
			})
		})
	})
})
