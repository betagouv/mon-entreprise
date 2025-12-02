import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation retraite de base', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe.skip('en début d’activité', () => {
			it('applique une assiette forfaitaire proratisée égale à 19% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . date de création': '31/01/2025',
					"entreprise . chiffre d'affaires": '10000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 43100)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
					8189
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base',
					1463
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			describe('avec une durée d’activité inférieure à 90 jours', () => {
				it('n’applique pas d’assiette minimale', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '60 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
					})

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						179
					)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '60 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'40000 €/an',
					})

					expect(e).toEvaluate('indépendant . PSS proratisé', 7742)
					// Tranche 1 :
					// PASS proratisé x taux tranche 1 = 7 742 €/an x 17,87% = 1 384 €/an

					// Tranche 2 :
					// assiette sociale - PASS proratisé = 40 000 €/an - 7 742 €/an = 32 258 €/an
					// (assiette sociale - PASS proratisé) x taux tranche 2 = 32 258 €/an x 0,72% = 232 €/an

					// Total :
					// Tranche 1 + Tranche 2 = 1 383 €/an + 232 €/an = 1 615 €/an
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						1616
					)
				})
			})

			describe('avec une durée d’activité supérieure à 90 jours', () => {
				it('applique l’assiette minimale', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '120 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
					})

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						955
					)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '120 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					expect(e).toEvaluate('indépendant . PSS proratisé', 15485)
					// Tranche 1 :
					// PASS proratisé x taux tranche 1 = 15 485 €/an x 17,87% = 2 767 €/an

					// Tranche 2 :
					// assiette sociale - PASS proratisé = 50 000 €/an - 15 485 €/an = 34 515 €/an
					// (assiette sociale - PASS proratisé) x taux tranche 2 = 34 515 €/an x 0,72% = 249 €/an

					// Total :
					// Tranche 1 + Tranche 2 = 2 767 €/an + 249 €/an = 3 016 €/an
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						3016
					)
				})
			})
		})

		it('applique un taux tranche 1 de 17,87%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . taux tranche 1',
				17.87
			)
		})

		it('applique un taux tranche 2 de 0,72%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . taux tranche 2',
				0.72
			)
		})

		it('applique une assiette minimale égale à 450 heures rémunérées au SMIC (5 346 € en 2025)', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				955
			)
		})

		it('applique le taux tranche 1 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				5361
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale supérieure au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 17,87% = 8 416,77 €/an

			// Tranche 2 :
			// assiette sociale - 1 PASS = 100 000 €/an - 47 100 €/an = 52 900 €/an
			// (assiette sociale - 1 PASS) x taux tranche 2 = 52 900 €/an x 0,72% = 380,88 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 8 416,77 €/an + 380,88 €/an = 8 798 €/an (arrondi à l'euro)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				8798
			)
		})

		describe('n’applique pas d’assiette minimale', () => {
			it('en cas de RSA ou de prime d’activité', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'situation personnelle . RSA': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base',
					179
				)
			})

			it('en cas d’activité saisonnière', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'entreprise . activité . saisonnière': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base',
					179
				)
			})
		})
	})
})
