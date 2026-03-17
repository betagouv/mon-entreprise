import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('En contrat d’apprentissage', () => {
	let engine: Engine<DottedName>
	let Smic: number
	beforeEach(() => {
		engine = new Engine(rules)
		Smic = engine.evaluate('SMIC').nodeValue as number
	})

	describe('La rémunération minimale', () => {
		describe('la 1ère année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				'salarié . contrat . apprentissage . ancienneté': "'moins de 1'",
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
				'salarié . contrat . apprentissage . ancienneté': "'moins de 2'",
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
				'salarié . contrat . apprentissage . ancienneté': "'moins de 3'",
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
				'salarié . contrat . apprentissage . ancienneté': "'moins de 4'",
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
})
