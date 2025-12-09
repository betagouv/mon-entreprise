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

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . retraite'
			).nodeValue
			expect(assietteMinimale).toEqual(5346)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				assietteMinimale
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(917)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				assietteMinimale
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(38)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
		})

		it('applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				30000
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(5145)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				30000
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(216)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à toute l’assiette sociale en cas d’assiette sociale supérieure au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			const PASS = e.evaluate('plafond sécurité sociale').nodeValue

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				PASS
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(8078)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				100000
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(720)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
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
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
						1000
					)
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
						1000
					)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '60 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'40000 €/an',
					})

					const PASSProratisé = e.evaluate(
						'indépendant . PSS proratisé'
					).nodeValue

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
						PASSProratisé
					)

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
						40000
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

					const assietteMinimale = e.evaluate(
						'indépendant . assiette minimale . retraite'
					).nodeValue
					expect(assietteMinimale).toEqual(5346)

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
						assietteMinimale
					)

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
						assietteMinimale
					)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						...defaultSituation,
						"entreprise . durée d'activité cette année": '120 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const PASSProratisé = e.evaluate(
						'indépendant . PSS proratisé'
					).nodeValue

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
						PASSProratisé
					)

					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
						50000
					)
				})
			})
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
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
					1000
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
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
					1000
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

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . retraite'
			).nodeValue
			expect(assietteMinimale).toEqual(5346)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				assietteMinimale
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(467)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				assietteMinimale
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(100)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
		})

		it('applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				30000
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(2619)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				30000
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(561)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à toute l’assiette sociale en cas d’assiette sociale comprise entre 1 et 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			const PASS = e.evaluate('plafond sécurité sociale').nodeValue

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				PASS
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(4112)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				100000
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(1870)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à 5 PASS en cas d’assiette sociale supérieure à 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'250000 €/an',
			})

			const PASS = e.evaluate('plafond sécurité sociale').nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
				PASS
			)
			const tranche1 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1'
			).nodeValue as number
			expect(tranche1).toEqual(4112)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
				5 * PASS
			)
			const tranche2 = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2'
			).nodeValue as number
			expect(tranche2).toEqual(4404)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				tranche1 + tranche2
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
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
					1000
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
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 1 . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite de base . tranche 2 . assiette',
					1000
				)
			})
		})
	})
})
