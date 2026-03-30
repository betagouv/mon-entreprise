import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('En contrat d’apprentissage', () => {
	let engine: Engine<RègleModèleSocial>
	let Smic: number
	beforeEach(() => {
		engine = new Engine(rules)
		Smic = engine.evaluate('SMIC').nodeValue as number
	})

	describe('la rémunération minimale', () => {
		describe('la 1ère année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2026',
			}

			it('est de 27% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.27 * Smic)
				)
			})

			it('est de 43% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.43 * Smic)
				)
			})

			it('est de 53% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.53 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 2ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2025',
			}

			it('est de 39% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.39 * Smic)
				)
			})

			it('est de 51% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.51 * Smic)
				)
			})

			it('est de 61% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.61 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 3ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2024',
			}

			it('est de 55% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.55 * Smic)
				)
			})

			it('est de 67% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.67 * Smic)
				)
			})

			it('est de 78% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.78 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 4ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2023',
			}

			it('est de 55% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.55 * Smic)
				)
			})

			it('est de 67% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.67 * Smic)
				)
			})

			it('est de 78% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.78 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})
	})

	describe('l’aide à l’embauche', () => {
		describe('pour les entreprises de moins de 250 salarié⋅es', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '08/03/2026',
				'entreprise . salariés . effectif': 249,
			}

			it('est de 5000 € si l’apprenti⋅e prépare un diplôme de niveau 4 ou moins', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 4 ou moins'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					5_000
				)
			})

			it('est de 4500 € si l’apprenti⋅e prépare un diplôme de niveau 5', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 5'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					4_500
				)
			})

			it('est de 2000 € si l’apprenti⋅e prépare un diplôme de niveau 6 ou 7', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 6 ou 7'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					2_000
				)
			})
		})

		describe('pour les entreprises de 250 salarié⋅es ou plus', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '08/03/2026',
				'entreprise . salariés . effectif': 250,
				'entreprise . salariés . ratio alternants': '5%',
			}

			it('est de 2000 € si l’apprenti⋅e prépare un diplôme de niveau 4 ou moins', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 4 ou moins'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					2_000
				)
			})

			it('est de 1500 € si l’apprenti⋅e prépare un diplôme de niveau 5', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 5'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					1_500
				)
			})

			it('est de 750 € si l’apprenti⋅e prépare un diplôme de niveau 6 ou 7', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 6 ou 7'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					750
				)
			})

			it('est nulle si l’entreprise a moins de 5% d’alternants', () => {
				const e = engine.setSituation({
					...situation,
					'entreprise . salariés . ratio alternants': '4%',
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					null
				)
			})
		})
	})
})
