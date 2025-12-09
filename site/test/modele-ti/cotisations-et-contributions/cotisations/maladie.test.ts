import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation maladie', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('en cas de domiciliation fiscale à l’étranger', () => {
			it('applique un taux de 14,5%', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
					"entreprise . chiffre d'affaires": '13514 €/an', // assiette sociale de 10 000 €/an
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie',
					1450
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			it('applique un taux nul en cas d’assiette sociale annualisée inférieure à 20% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '355 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					0
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					0
				)
			})

			it('applique un taux progressif compris entre 0% et 1,5% en cas d’assiette sociale annualisée comprise entre 20% et 40% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '181 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					0.11
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					6
				)
			})

			it('applique un taux progressif compris entre 1,5% et 4% en cas d’assiette sociale annualisée comprise entre 40% et 60% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '90 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					1.88
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					94
				)
			})

			it('applique un taux progressif compris entre 4% et 6,5% en cas d’assiette sociale annualisée comprise entre 60% et 110% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '60 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					4.23
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					212
				)
			})

			it('applique un taux progressif compris entre 6,5% et 7,7% en cas d’assiette sociale annualisée comprise entre 110% et 200% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '31 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					6.7
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					335
				)
			})

			it('applique un taux progressif compris entre 7,7% et 8,5% en cas d’assiette sociale annualisée comprise entre 200% et 300% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '19 jour',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					7.73
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					386
				) // devrait être 387, problème d'arrondi ?
			})

			it('applique un taux 1 de 8,5% à 3 PASS et un taux 2 de 6,5% au reste de l’assiette sociale en cas d’assiette sociale annualisée supérieure à 300% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '10 jour',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 1290)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
					8.5
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 2',
					6.5
				)
				// Tranche 1 :
				// 3 PASS proratisé = 3 x 1 290 €/an = 3 870 €/an
				// Taux 1 x 3 PASS = 8,5% x 3 870 €/an = 328,95 €/an

				// Tranche 2 :
				// assiette sociale - 3 PASS proratisé = 5 000 €/an - 3 870 €/an = 1 130 €/an
				// Taux 2 x (assiette sociale - 3 PASS) = 6,5% x 1 130 €/an = 73,45 €/an

				// Total :
				// Tranche 1 + Tranche 2 = 328,95 €/an + 73,45 €/an = 402 €/an (arrondi à l'euro)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
					402
				)
			})
		})

		it('applique un taux nul en cas d’assiette sociale inférieure à 20% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'8949 €/an', // 19% du PASS
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				0
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				0
			)
		})

		it('applique un taux progressif compris entre 0% et 1,5% en cas d’assiette sociale comprise entre 20% et 40% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				0.09
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				9
			)
		})

		it('applique un taux progressif compris entre 1,5% et 4% en cas d’assiette sociale comprise entre 40% et 60% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'23000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				2.6
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				598
			)
		})

		it('applique un taux progressif compris entre 4% et 6,5% en cas d’assiette sociale comprise entre 60% et 110% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				5.25
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				2100
			)
		})

		it('applique un taux progressif compris entre 6,5% et 7,7% en cas d’assiette sociale comprise entre 110% et 200% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				6.73
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				4038
			)
		})

		it('applique un taux progressif compris entre 7,7% et 8,5% en cas d’assiette sociale comprise entre 200% et 300% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				7.8
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				7800
			)
		})

		it('applique un taux 1 de 8,5% à 3 PASS et un taux 2 de 6,5% au reste de l’assiette sociale en cas d’assiette sociale supérieure à 300% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				8.5
			)
			// Tranche 1 :
			// 3 PASS = 3 x 47 100 €/an = 141 300 €/an
			// Taux 1 x 3 PASS = 8,5% x 141 300 €/an = 12 010,5 €/an

			// Tranche 2 :
			// assiette sociale - 3 PASS = 150 000 €/an - 141 300 €/an = 8 700 €/an
			// Taux 2 x (assiette sociale - 3 PASS) = 6,5% x 8 700 €/an = 565,5 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 12 010,5 €/an + 565,5 €/an = 12 576 €/an
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				12576
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
					'8949 €/an', // 19% du PASS
			})

			expect(e1).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				0
			)
			expect(e1).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				0
			)

			const e2 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})

			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				0.09
			)
			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				9
			)

			const e3 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'23000 €/an',
			})

			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				2.6
			)
			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				598
			)

			const e4 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})

			expect(e4).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				5.25
			)
			expect(e4).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				2100
			)

			const e5 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e5).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				6.73
			)
			expect(e5).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				4038
			)

			const e6 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			expect(e6).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				7.8
			)
			expect(e6).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				7800
			)

			const e7 = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e7).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . taux 1',
				8.5
			)
			// Tranche 1 :
			// 3 PASS = 3 x 47 100 €/an = 141 300 €/an
			// Taux 1 x 3 PASS = 8,5% x 141 300 €/an = 12 010,5 €/an

			// Tranche 2 :
			// assiette sociale - 3 PASS = 150 000 €/an - 141 300 €/an = 8 700 €/an
			// Taux 2 x (assiette sociale - 3 PASS) = 6,5% x 8 700 €/an = 565,5 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 12 010,5 €/an + 565,5 €/an = 12 576 €/an
			expect(e7).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				12576
			)
		})

		it('applique un barème différent avant la réforme', () => {
			const e1 = engine.setSituation({
				...defaultSituationPLR,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'18369 €/an', // 39% du PASS
			})

			expect(e1).toEvaluate('indépendant . PL . maladie . taux', 0)
			expect(e1).toEvaluate('indépendant . PL . maladie', 0)
			expect(e1).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				0
			)

			const e2 = engine.setSituation({
				...defaultSituationPLR,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'25000 €/an',
			})

			expect(e2).toEvaluate('indépendant . PL . maladie . taux', 2.62)
			expect(e2).toEvaluate('indépendant . PL . maladie', 655)
			expect(e2).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				655
			)

			const e3 = engine.setSituation({
				...defaultSituationPLR,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e3).toEvaluate('indépendant . PL . maladie . taux', 6.31)
			expect(e3).toEvaluate('indépendant . PL . maladie', 3155)
			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				3155
			)

			const e4 = engine.setSituation({
				...defaultSituationPLR,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			expect(e4).toEvaluate('indépendant . PL . maladie . taux', 6.5)
			expect(e4).toEvaluate('indépendant . PL . maladie', 6500)
			expect(e4).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité',
				6500
			)
		})
	})
})
