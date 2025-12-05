import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation allocations familiales', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('en début d’activité', () => {
			it('applique une assiette forfaitaire proratisée égale à 19% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . date de création': '31/01/2025',
					"entreprise . chiffre d'affaires": '10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales',
					0
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			it('applique un taux nul en cas d’assiette sociale annualisée inférieure à 110% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '355 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
					0
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales',
					0
				)
			})

			it('applique un taux progressif compris entre 0% et 3,10% en cas d’assiette sociale annualisée comprise entre 110% et 140% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '304 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
					1.8
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales',
					900
				)
			})

			it('applique un taux de 3,10% en cas d’assiette sociale annualisée supérieure à 140% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '260 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
					3.1
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . allocations familiales',
					1550
				)
			})
		})

		it('applique un taux nul en cas d’assiette sociale inférieure à 110% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				0
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				0
			)
		})

		it('applique un taux progressif compris entre 0% et 3,10% en cas d’assiette sociale comprise entre 110% et 140% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				1.8
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				1080
			)
		})

		it('applique un taux de 3,10% en cas d’assiette sociale supérieure à 140% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				3.1
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				2170
			)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . PL . régime général': 'non',
		}

		it('applique le même barème que pour les artisans, commerçants et PLNR', () => {
			const e1 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e1).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				0
			)
			expect(e1).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				0
			)

			const e2 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				1.8
			)
			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				1080
			)

			const e3 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales . taux',
				3.1
			)
			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				2170
			)
		})
	})
})
