import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATION =
	'indépendant . cotisations et contributions . cotisations . retraite de base'

describe('Cotisation retraite de base', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		const TAUX_T1 = 17.87 / 100
		const TAUX_T2 = 0.72 / 100

		it('applique un taux T1 de 17,87%', () => {
			expect(engine).toEvaluate(`${COTISATION} . taux T1`, 100 * TAUX_T1)
		})

		it('applique un taux tranche 2 de 0,72%', () => {
			expect(engine).toEvaluate(`${COTISATION} . taux T2`, 100 * TAUX_T2)
		})

		it('applique une assiette minimale égale à 450 heures rémunérées au SMIC', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const SmicHoraire = e.evaluate('SMIC . horaire').nodeValue as number
			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . retraite'
			).nodeValue as number

			expect(assietteMinimale).toEqual(450 * SmicHoraire)
			expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)

			expect(e).toEvaluate(COTISATION, Math.round(assietteMinimale * TAUX_T1))
		})

		it('applique le taux T1 uniquement en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)
			expect(e).toEvaluate(COTISATION, Math.round(30_000 * TAUX_T1))
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale supérieure au PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			const T1 = PASS * TAUX_T1
			const T2 = (100_000 - PASS) * TAUX_T2

			expect(e).toEvaluate(COTISATION, Math.round(T1 + T2))
		})

		describe('en cas d’année incomplète', () => {
			describe('avec une durée d’activité inférieure à 90 jours', () => {
				it('n’applique pas d’assiette minimale', () => {
					const e = engine.setSituation({
						"entreprise . durée d'activité cette année": '60 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
					})

					expect(e).toEvaluate(`${COTISATION} . assiette`, 1_000)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						"entreprise . durée d'activité cette année": '60 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'40000 €/an',
					})

					const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
						.nodeValue as number
					expect(PASSProratisé).toEqual(Math.round((PASS * 60) / 365))

					const T1 = PASSProratisé * TAUX_T1
					const T2 = (40_000 - PASSProratisé) * TAUX_T2

					expect(e).toEvaluate(COTISATION, Math.round(T1 + T2))
				})
			})

			describe('avec une durée d’activité supérieure à 90 jours', () => {
				it('applique l’assiette minimale', () => {
					const e = engine.setSituation({
						"entreprise . durée d'activité cette année": '120 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
					})

					const assietteMinimale = e.evaluate(
						'indépendant . assiette minimale . retraite'
					).nodeValue as number

					expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)
				})

				it('applique un plafond tranche 1 proratisé', () => {
					const e = engine.setSituation({
						"entreprise . durée d'activité cette année": '120 jour',
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
						.nodeValue as number
					expect(PASSProratisé).toEqual(Math.round((PASS * 120) / 365))

					const T1 = PASSProratisé * TAUX_T1
					const T2 = (50_000 - PASSProratisé) * TAUX_T2

					expect(e).toEvaluate(COTISATION, Math.round(T1 + T2))
				})
			})
		})

		describe('n’applique pas d’assiette minimale', () => {
			it('en cas de RSA ou de prime d’activité', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'situation personnelle . RSA': 'oui',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 1_000)
			})

			it('en cas d’activité saisonnière', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'entreprise . activité . saisonnière': 'oui',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 1_000)
			})
		})

		it('applique la déduction tabac à l’assiette sociale', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
				'entreprise . activité . commerciale . débit de tabac': 'oui',
				'indépendant . cotisations et contributions . déduction tabac':
					'10000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000 - 10_000)
		})
	})

	describe('pour les PLR', () => {
		const COTISATION_PLR =
			'indépendant . profession libérale . CNAVPL . retraite de base'

		const TAUX_T1 = 8.73 / 100
		const TAUX_T2 = 1.87 / 100

		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique un taux tranche 1 de 8,73%', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 1 . taux`,
				100 * TAUX_T1
			)
		})

		it('applique un taux tranche 2 de 1,87%', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 2 . taux`,
				100 * TAUX_T2
			)
		})

		it('applique une assiette minimale égale à 450 heures rémunérées au SMIC', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const SmicHoraire = e.evaluate('SMIC . horaire').nodeValue as number
			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . retraite'
			).nodeValue as number

			// Assiette minimale
			expect(assietteMinimale).toEqual(450 * SmicHoraire)
			expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)

			// Tranche 1
			const tranche1 = e.evaluate(`${COTISATION_PLR} . tranche 1`)
				.nodeValue as number
			expect(tranche1).toEqual(Math.round(assietteMinimale * TAUX_T1))

			// Tranche 2
			const tranche2 = e.evaluate(`${COTISATION_PLR} . tranche 2`)
				.nodeValue as number
			expect(tranche2).toEqual(Math.round(assietteMinimale * TAUX_T2))

			// Total
			expect(e).toEvaluate(COTISATION, tranche1 + tranche2)
		})

		it('applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 1`,
				Math.round(30_000 * TAUX_T1)
			)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 2`,
				Math.round(30_000 * TAUX_T2)
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à toute l’assiette sociale en cas d’assiette sociale comprise entre 1 et 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 1`,
				Math.round(PASS * TAUX_T1)
			)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 2`,
				Math.round(100_000 * TAUX_T2)
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à 5 PASS en cas d’assiette sociale supérieure à 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'250000 €/an',
			})

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 1`,
				Math.round(PASS * TAUX_T1)
			)

			expect(e).toEvaluate(
				`${COTISATION_PLR} . tranche 2`,
				Math.round(5 * PASS * TAUX_T2)
			)
		})

		it('applique une exonération totale en cas d’exonération incapacité', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(COTISATION, 0)
		})

		describe('n’applique pas d’assiette minimale', () => {
			it('en cas de RSA ou de prime d’activité', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'situation personnelle . RSA': 'oui',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 1_000)
			})

			it('en cas d’activité saisonnière', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'entreprise . activité . saisonnière': 'oui',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 1_000)
			})
		})
	})
})
