import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import rules from '../../../modele-ti/dist/index.js'

describe('Indépendant', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('à l’IR', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IR'",
			'entreprise . charges': '10000 €/an',
			'impôt . méthode de calcul': "'taux personnalisé'",
			'impôt . taux personnalisé': '25%',
		}

		describe('à partir du chiffre d’affaires', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": '50000 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 28072)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": '50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					20840
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '28072 €/an',
				})

				expect(e).toEvaluate("entreprise . chiffre d'affaires", 50000)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '28072 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					20840
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '20840 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 28072)
			})
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '20840 €/an',
				})

				expect(e).toEvaluate("entreprise . chiffre d'affaires", 50000)
			})
		})
	})

	describe('à l’IS', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IS'",
			'impôt . méthode de calcul': "'taux personnalisé'",
			'impôt . taux personnalisé': '25%',
		}

		describe('à partir de la rémunération totale', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . totale': '40000 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 28072)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . totale': '40000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					20840
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '28072 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . totale', 40000)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': '28072 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					20840
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '20840 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . nette', 28072)
			})
			it('calcule la rémunération totale', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': '20840 €/an',
				})

				expect(e).toEvaluate('indépendant . rémunération . totale', 40000)
			})
		})
	})
})
