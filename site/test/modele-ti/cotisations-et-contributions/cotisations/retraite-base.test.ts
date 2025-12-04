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
					// PASS proratisé x taux tranche 1 = 7 742 €/an x 17,15% = 1 328 €/an

					// Tranche 2 :
					// assiette sociale x taux tranche 2 = 40 000 €/an x 0,72% = 288 €/an

					// Total :
					// Tranche 1 + Tranche 2 = 1 328 €/an + 288 €/an = 1 616 €/an
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
					// PASS proratisé x taux tranche 1 = 15 485 €/an x 17,15% = 2 656 €/an

					// Tranche 2 :
					// assiette sociale x taux tranche 2 = 50 000 €/an x 0,72% = 360 €/an

					// Total :
					// Tranche 1 + Tranche 2 = 2 656 €/an + 360 €/an = 3 016 €/an
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						3016
					)
				})
			})
		})

		it('applique un taux tranche 1 de 17,15%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . taux',
				17.15
			)
		})

		it('applique un taux tranche 2 de 0,72%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . taux',
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
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				5346
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				955
			)
		})

		it('applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
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

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à toute l’assiette sociale en cas d’assiette sociale supérieure au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 17,15% = 8 078 €/an

			// Tranche 2 :
			// assiette sociale x taux tranche 2 = 100 000 €/an x 0,72% = 720 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 8 078 €/an + 720 €/an = 8 798 €/an
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

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . PL . régime général': 'non',
		}

		it('applique un taux tranche 1 de 8,73%', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . taux',
				8.73
			)
		})

		it('applique un taux tranche 2 de 1,87%', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . taux',
				1.87
			)
		})

		it('applique une assiette minimale égale à 450 heures rémunérées au SMIC (5 346 € en 2025)', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				5346
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				567
			)
		})

		it('applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				3180
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à toute l’assiette sociale en cas d’assiette sociale comprise entre 1 et 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 8,73% = 4 112 €/an

			// Tranche 2 :
			// assiette sociale x taux tranche 2 = 100 000 €/an x 1,87% = 1 870 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 4 112 €/an + 1 870 €/an = 5 982 €/an
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				5982
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à 5 PASS en cas d’assiette sociale supérieure à 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'250000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 8,73% = 4 112 €/an

			// Tranche 2 :
			// 5 PASS x taux tranche 2 = 235 500 €/an x 1,87% = 4 404 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 4 112 €/an + 4 404 €/an = 8 516 €/an
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				8516
			)
		})

		it('applique une exonération totale en cas d’exonération incapacité', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
				'indépendant . PL . CNAVPL . exonération incapacité': 'oui',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				0
			)
		})

		describe('n’applique pas d’assiette minimale', () => {
			it('en cas de RSA ou de prime d’activité', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'situation personnelle . RSA': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base',
					106
				)
			})

			it('en cas d’activité saisonnière', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'entreprise . activité . saisonnière': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base',
					106
				)
			})
		})
	})
})
