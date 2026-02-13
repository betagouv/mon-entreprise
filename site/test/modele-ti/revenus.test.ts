import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Indépendant', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})
	const CA = 50000
	const CHARGES = 10000
	const RÉMUNÉRATION_TOTALE = CA - CHARGES
	const RÉMUNÉRATION_NETTE = 27580

	describe('à l’IR', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IR'",
			'entreprise . charges': `${CHARGES} €/an`,
		}
		const RÉMUNÉRATION_NETTE_APRÈS_IMPÔT = 25762

		describe('à partir du chiffre d’affaires', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": `${CA} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette',
					RÉMUNÉRATION_NETTE
				)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					"entreprise . chiffre d'affaires": `${CA} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					RÉMUNÉRATION_NETTE_APRÈS_IMPÔT
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				const CACalculé = e.evaluate("entreprise . chiffre d'affaires")
					.nodeValue as number
				expect(Math.abs(CA - CACalculé)).toBeLessThanOrEqual(1)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					RÉMUNÉRATION_NETTE_APRÈS_IMPÔT
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': `${RÉMUNÉRATION_NETTE_APRÈS_IMPÔT} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette',
					RÉMUNÉRATION_NETTE
				)
			})
			it('calcule le chiffre d’affaires', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': `${RÉMUNÉRATION_NETTE_APRÈS_IMPÔT} €/an`,
				})

				const CACalculé = e.evaluate("entreprise . chiffre d'affaires")
					.nodeValue as number
				expect(Math.abs(CA - CACalculé)).toBeLessThanOrEqual(1)
			})
		})
	})

	describe('à l’IS', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IS'",
		}
		const RÉMUNÉRATION_NETTE_APRÈS_IMPÔT = 26217

		describe('à partir de la rémunération brute', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . brute': `${RÉMUNÉRATION_TOTALE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette',
					RÉMUNÉRATION_NETTE
				)
			})
			it('calcule la rémunération nette avec dividendes', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . brute': `${RÉMUNÉRATION_TOTALE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . avec dividendes',
					RÉMUNÉRATION_NETTE
				)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . brute': `${RÉMUNÉRATION_TOTALE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					RÉMUNÉRATION_NETTE_APRÈS_IMPÔT
				)
			})
		})

		describe('à partir de la rémunération nette', () => {
			it('calcule la rémunération brute', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				const rémunérationTotaleCalculée = e.evaluate(
					'indépendant . rémunération . brute'
				).nodeValue as number
				expect(
					Math.abs(RÉMUNÉRATION_TOTALE - rémunérationTotaleCalculée)
				).toBeLessThanOrEqual(1)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					RÉMUNÉRATION_NETTE_APRÈS_IMPÔT
				)
			})
		})

		describe('à partir de la rémunération nette avec dividendes', () => {
			it('calcule la rémunération brute', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . avec dividendes': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				const rémunérationTotaleCalculée = e.evaluate(
					'indépendant . rémunération . brute'
				).nodeValue as number
				expect(
					Math.abs(RÉMUNÉRATION_TOTALE - rémunérationTotaleCalculée)
				).toBeLessThanOrEqual(1)
			})
			it('calcule le revenu après impôt', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . avec dividendes': `${RÉMUNÉRATION_NETTE} €/an`,
				})

				expect(e).toEvaluate(
					'indépendant . rémunération . nette . après impôt',
					RÉMUNÉRATION_NETTE_APRÈS_IMPÔT
				)
			})
		})

		describe('à partir du revenu après impôt', () => {
			it('calcule la rémunération nette', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': `${RÉMUNÉRATION_NETTE_APRÈS_IMPÔT} €/an`,
				})

				const rémunérationNetteCalculée = e.evaluate(
					'indépendant . rémunération . nette'
				).nodeValue as number
				expect(
					Math.abs(RÉMUNÉRATION_NETTE - rémunérationNetteCalculée)
				).toBeLessThanOrEqual(1)
			})
			it('calcule la rémunération nette avec dividendes', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': `${RÉMUNÉRATION_NETTE_APRÈS_IMPÔT} €/an`,
				})

				const rémunérationNetteCalculée = e.evaluate(
					'indépendant . rémunération . nette . avec dividendes'
				).nodeValue as number
				expect(
					Math.abs(RÉMUNÉRATION_NETTE - rémunérationNetteCalculée)
				).toBeLessThanOrEqual(1)
			})
			it('calcule la rémunération brute', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'indépendant . rémunération . nette . après impôt': `${RÉMUNÉRATION_NETTE_APRÈS_IMPÔT} €/an`,
				})

				const rémunérationTotaleCalculée = e.evaluate(
					'indépendant . rémunération . brute'
				).nodeValue as number
				expect(
					Math.abs(RÉMUNÉRATION_TOTALE - rémunérationTotaleCalculée)
				).toBeLessThanOrEqual(3)
			})
		})
	})
})
