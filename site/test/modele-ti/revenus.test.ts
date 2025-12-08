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

				expect(e).toEvaluate('indépendant . rémunération . nette', 27713)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": '50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					25874
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27713 €/an',
				})

				const CA = e.evaluate("entreprise . chiffre d'affaires")
					.nodeValue as number
				expect(Math.abs(50000 - CA)).toBeLessThanOrEqual(1)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27713 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					25874
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '25874 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27713)
			})
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '25874 €/an',
				})

				const CA = e.evaluate("entreprise . chiffre d'affaires")
					.nodeValue as number
				expect(Math.abs(50000 - CA)).toBeLessThanOrEqual(1)
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

				expect(e).toEvaluate('indépendant . rémunération . nette', 27713)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . totale': '40000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					26330
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27713 €/an',
				})

				const rémunérationTotale = e.evaluate(
					'indépendant . rémunération . totale'
				).nodeValue as number
				expect(Math.abs(40000 - rémunérationTotale)).toBeLessThanOrEqual(1)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '27713 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					26330
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '26330 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 27713)
			})
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '26330 €/an',
				})

				const rémunérationTotale = e.evaluate(
					'indépendant . rémunération . totale'
				).nodeValue as number
				expect(Math.abs(40000 - rémunérationTotale)).toBeLessThanOrEqual(1)
			})
		})
	})
})
