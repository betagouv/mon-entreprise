import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Domiciliation', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('outre-mer', () => {
		const RULE = 'établissement . domiciliation . outre-mer'

		it('est fausse par défaut', () => {
			expect(engine).toEvaluate(RULE, false)
		})

		describe('en répondant à la question sur l’outre-mer', () => {
			it.each([['mayotte'], ['drom hors mayotte']])(
				'est vraie pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'paramètres . domiciliation . distinction alsace-moselle': 'non',
						'établissement . outre-mer': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it('est fausse pour "métropole"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'métropole'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})

		describe('en répondant à la question sur la zone', () => {
			it.each([['mayotte'], ['drom hors mayotte']])(
				'est vraie pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . zone': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it.each([['autre'], ['alsace-moselle']])(
				'est fausse pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . zone': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, false)
				}
			)
		})
	})

	describe('outre-mer hors mayotte', () => {
		const RULE = 'établissement . domiciliation . outre-mer . hors mayotte'

		it('est nulle par défaut', () => {
			expect(engine).toEvaluate(RULE, null)
		})

		describe('en répondant à la question sur l’outre-mer', () => {
			it('est vraie pour "drom hors mayotte"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'drom hors mayotte'",
				})

				expect(e).toEvaluate(RULE, true)
			})

			it('est fausse pour "mayotte"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'mayotte'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})

		describe('en répondant à la question sur la zone', () => {
			it('est vraie pour "drom hors mayotte"', () => {
				const e = engine.setSituation({
					'établissement . zone': "'drom hors mayotte'",
				})

				expect(e).toEvaluate(RULE, true)
			})

			it('est fausse pour "mayotte"', () => {
				const e = engine.setSituation({
					'établissement . zone': "'mayotte'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})
	})
})
