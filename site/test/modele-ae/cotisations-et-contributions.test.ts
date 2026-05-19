import rules from 'modele-ae'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const CA = 2_000

describe('Calcul des cotisations et contributions à partir du chiffre d’affaires', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour une activité commerciale', () => {
		it('de vente', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'commerciale'",
				'entreprise . activité . principale': "'vente'",
			})

			const cotisations = Math.round((CA * 12.3) / 100)
			const CFP = Math.round((CA * 0.1) / 100)
			const TFC = Math.round((CA * 0.015) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . commerce'
			)
			expect(e).not.toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . métiers'
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				TFC
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP + TFC
			)
		})

		it('de service', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'commerciale'",
				'entreprise . activité . principale': "'service'",
			})

			const cotisations = Math.round((CA * 21.2) / 100)
			const CFP = Math.round((CA * 0.1) / 100)
			const TFC = Math.round((CA * 0.044) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . commerce'
			)
			expect(e).not.toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . métiers'
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				TFC
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP + TFC
			)
		})
	})

	describe('pour une activité artisanale', () => {
		it('de vente', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'artisanale'",
				'entreprise . activité . principale': "'vente'",
			})

			const cotisations = Math.round((CA * 12.3) / 100)
			const CFP = Math.round((CA * 0.3) / 100)
			const TFC = Math.round((CA * 0.22) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).not.toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . commerce'
			)
			expect(e).toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . métiers'
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				TFC
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP + TFC
			)
		})

		it('de service', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'artisanale'",
				'entreprise . activité . principale': "'service'",
			})

			const cotisations = Math.round((CA * 21.2) / 100)
			const CFP = Math.round((CA * 0.3) / 100)
			const TFC = Math.round((CA * 0.48) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).not.toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . commerce'
			)
			expect(e).toBeApplicable(
				'auto-entrepreneur . cotisations et contributions . TFC . métiers'
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				TFC
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP + TFC
			)
		})
	})

	describe('pour une activité libérale', () => {
		it('non réglementée', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'non',
			})

			const cotisations = Math.round((CA * 25.6) / 100)
			const CFP = Math.round((CA * 0.2) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				0
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP
			)
		})

		it('réglementée (Cipav)', () => {
			const e = engine.setSituation({
				"entreprise . chiffre d'affaires": `${CA} €/mois`,
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
			})

			const cotisations = Math.round((CA * 23.2) / 100)
			const CFP = Math.round((CA * 0.2) / 100)

			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . cotisations',
				cotisations
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . CFP',
				CFP
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions . TFC',
				0
			)
			expect(e).toEvaluate(
				'auto-entrepreneur . cotisations et contributions',
				cotisations + CFP
			)
		})
	})
})
