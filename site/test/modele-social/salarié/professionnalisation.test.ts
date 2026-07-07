import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('En contrat de professionnalisation', () => {
	let engine: Engine<RègleModèleSocial>
	let Smic: number
	beforeEach(() => {
		engine = new Engine(rules)
		Smic = engine.evaluate('SMIC').nodeValue as number
	})

	describe('la rémunération minimale', () => {
		describe('avec un niveau de formation inférieur au bac', () => {
			const situation = {
				'salarie . contrat': "'professionnalisation'",
				'salarie . contrat . professionnalisation . formation':
					"'moins que bac'",
			}

			it('est de 55% du Smic pour les salarie⋅es de moins de 21 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'moins de 21'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(0.55 * Smic)
				)
			})

			it('est de 70% du Smic pour les salarie⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(0.7 * Smic)
				)
			})

			it('est de 100% du Smic pour les salarie⋅es de 26 à 44 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'de 26 à 44'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(Smic)
				)
			})

			it('est de 100% du Smic pour les salarie⋅es de 45 ans ou plus', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'plus de 44'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('avec un niveau de formation supérieur ou égal au bac', () => {
			const situation = {
				'salarie . contrat': "'professionnalisation'",
				'salarie . contrat . professionnalisation . formation': "'bac ou plus'",
			}

			it('est de 65% du Smic pour les salarie⋅es de moins de 21 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'moins de 21'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(0.65 * Smic)
				)
			})

			it('est de 80% du Smic pour les salarie⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(0.8 * Smic)
				)
			})

			it('est de 100% du Smic pour les salarie⋅es de 26 à 44 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'de 26 à 44'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(Smic)
				)
			})

			it('est de 100% du Smic pour les salarie⋅es de 45 ans ou plus', () => {
				const e = engine.setSituation({
					...situation,
					'salarie . contrat . professionnalisation . âge': "'plus de 44'",
				})

				expect(e).toEvaluate(
					'salarie . contrat . professionnalisation . rémunération minimale',
					Math.round(Smic)
				)
			})
		})
	})
})
