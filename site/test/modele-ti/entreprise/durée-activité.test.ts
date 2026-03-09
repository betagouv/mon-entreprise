import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Durée d’æctivité', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('en fin d’année', () => {
		it('vaut 0 si la date de création est postérieure au 31 décembre', () => {
			const e = engine.setSituation({
				"période . fin d'année": '31/12/2026',
				'entreprise . date de création': '18/02/2027',
			})

			expect(e).toEvaluate("entreprise . durée d'activité . en fin d'année", 0)
		})

		it('vaut 7 jours si la date de création le 25 décembre', () => {
			const e = engine.setSituation({
				"période . fin d'année": '31/12/2026',
				'entreprise . date de création': '25/12/2026',
			})

			expect(e).toEvaluate("entreprise . durée d'activité . en fin d'année", 7)
		})

		it('vaut 1 si la date de création est le 31 décembre', () => {
			const e = engine.setSituation({
				"période . fin d'année": '31/12/2026',
				'entreprise . date de création': '31/12/2026',
			})

			expect(e).toEvaluate("entreprise . durée d'activité . en fin d'année", 1)
		})
	})

	describe('en début d’année', () => {
		it('vaut 0 si la date de création est postérieure au 1er janvier', () => {
			const e = engine.setSituation({
				"période . début d'année": '01/01/2026',
				'entreprise . date de création': '18/02/2026',
			})

			expect(e).toEvaluate(
				"entreprise . durée d'activité . en début d'année",
				0
			)
		})

		it('vaut 7 jours si la date de création le 25 décembre de l’année précédente', () => {
			const e = engine.setSituation({
				"période . début d'année": '01/01/2026',
				'entreprise . date de création': '25/12/2025',
			})

			expect(e).toEvaluate(
				"entreprise . durée d'activité . en début d'année",
				7
			)
		})

		it('vaut 0 si la date de création est le 1er janvier', () => {
			const e = engine.setSituation({
				"période . début d'année": '01/01/2026',
				'entreprise . date de création': '01/01/2026',
			})

			expect(e).toEvaluate(
				"entreprise . durée d'activité . en début d'année",
				0
			)
		})
	})
})
