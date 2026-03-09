import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { round } from '@/utils/number'

const COTISATION =
	'indépendant . cotisations et contributions . cotisations . maladie-maternité'

const TAUX1_T1 = 1.5 / 100
const TAUX1_T2 = 4 / 100
const TAUX1_T3 = 6.5 / 100
const TAUX1_T4 = 7.7 / 100
const TAUX1_T5 = 8.5 / 100
const TAUX2 = 6.5 / 100

describe('Cotisation maladie', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('applique un taux nul en cas d’assiette sociale inférieure à 20% du PASS', () => {
			const plancherTaux1 = Math.round(0.2 * PASS) - 1
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale': `${plancherTaux1} €/an`,
			})

			expect(e).toEvaluate(`${COTISATION} avant abattements . taux 1`, 0)
			expect(e).toEvaluate(COTISATION, 0)
		})

		it('applique un taux progressif compris entre 0% et 1,5% en cas d’assiette sociale comprise entre 20% et 40% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})
			const taux =
				round((100 * TAUX1_T1 * (10_000 - 0.2 * PASS)) / (0.2 * PASS), 2) / 100

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux
			)
			expect(e).toEvaluate(COTISATION, Math.round(10_000 * taux))
		})

		it('applique un taux progressif compris entre 1,5% et 4% en cas d’assiette sociale comprise entre 40% et 60% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'23000 €/an',
			})
			const taux =
				round(
					100 *
						(TAUX1_T1 +
							((TAUX1_T2 - TAUX1_T1) * (23_000 - 0.4 * PASS)) / (0.2 * PASS)),
					2
				) / 100

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux
			)
			expect(e).toEvaluate(COTISATION, Math.round(23_000 * taux))
		})

		it('applique un taux progressif compris entre 4% et 6,5% en cas d’assiette sociale comprise entre 60% et 110% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})
			const taux =
				round(
					100 *
						(TAUX1_T2 +
							((TAUX1_T3 - TAUX1_T2) * (40_000 - 0.6 * PASS)) / (0.5 * PASS)),
					2
				) / 100

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux
			)
			expect(e).toEvaluate(COTISATION, Math.round(40_000 * taux))
		})

		it('applique un taux progressif compris entre 6,5% et 7,7% en cas d’assiette sociale comprise entre 110% et 200% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})
			const taux =
				round(
					100 *
						(TAUX1_T3 +
							((TAUX1_T4 - TAUX1_T3) * (60_000 - 1.1 * PASS)) / (0.9 * PASS)),
					2
				) / 100

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux
			)
			expect(e).toEvaluate(COTISATION, Math.round(60_000 * taux))
		})

		it('applique un taux progressif compris entre 7,7% et 8,5% en cas d’assiette sociale comprise entre 200% et 300% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})
			const taux =
				round(
					100 *
						(TAUX1_T4 +
							((TAUX1_T5 - TAUX1_T4) * (100_000 - 2 * PASS)) / (1 * PASS)),
					2
				) / 100

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux
			)
			expect(e).toEvaluate(COTISATION, Math.round(100_000 * taux))
		})

		it('applique un taux 1 de 8,5% à 3 PASS et un taux 2 de 6,5% au reste de l’assiette sociale en cas d’assiette sociale supérieure à 300% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} avant abattements . taux 1`, 8.5)
			expect(e).toEvaluate(
				COTISATION,
				Math.round(3 * PASS * TAUX1_T5 + (150_000 - 3 * PASS) * TAUX2)
			)
		})

		// Exemples issus de la doc Urssaf
		describe('en cas d’année incomplète', () => {
			it('applique un taux nul en cas d’assiette sociale annualisée inférieure à 20% du PASS', () => {
				const e = engine.setSituation({
					'plafond sécurité sociale': '47100 €/an',
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '355 jour',
				})

				expect(e).toEvaluate(`${COTISATION} avant abattements . taux 1`, 0)
				expect(e).toEvaluate(COTISATION, 0)
			})

			it('applique un taux progressif compris entre 0% et 1,5% en cas d’assiette sociale annualisée comprise entre 20% et 40% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '181 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						(100 * TAUX1_T1 * (5_000 - 0.2 * PASSProratisé)) /
							(0.2 * PASSProratisé),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(5_000 * taux))
			})

			it('applique un taux progressif compris entre 1,5% et 4% en cas d’assiette sociale annualisée comprise entre 40% et 60% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '90 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						100 *
							(TAUX1_T1 +
								((TAUX1_T2 - TAUX1_T1) * (5_000 - 0.4 * PASSProratisé)) /
									(0.2 * PASSProratisé)),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(5_000 * taux))
			})

			it('applique un taux progressif compris entre 4% et 6,5% en cas d’assiette sociale annualisée comprise entre 60% et 110% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '60 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						100 *
							(TAUX1_T2 +
								((TAUX1_T3 - TAUX1_T2) * (5_000 - 0.6 * PASSProratisé)) /
									(0.5 * PASSProratisé)),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(5_000 * taux))
			})

			it('applique un taux progressif compris entre 6,5% et 7,7% en cas d’assiette sociale annualisée comprise entre 110% et 200% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '31 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						100 *
							(TAUX1_T3 +
								((TAUX1_T4 - TAUX1_T3) * (5_000 - 1.1 * PASSProratisé)) /
									(0.9 * PASSProratisé)),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(5_000 * taux))
			})

			it('applique un taux progressif compris entre 7,7% et 8,5% en cas d’assiette sociale annualisée comprise entre 200% et 300% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '19 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						100 *
							(TAUX1_T4 +
								((TAUX1_T5 - TAUX1_T4) * (5_000 - 2 * PASSProratisé)) /
									(1 * PASSProratisé)),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(5_000 * taux))
			})

			it('applique un taux 1 de 8,5% à 3 PASS et un taux 2 de 6,5% au reste de l’assiette sociale en cas d’assiette sociale annualisée supérieure à 300% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'5000 €/an',
					"entreprise . durée d'activité cette année": '10 jour',
				})
				const PASSProratisé = engine.evaluate('indépendant . PSS proratisé')
					.nodeValue as number

				expect(e).toEvaluate(`${COTISATION} avant abattements . taux 1`, 8.5)
				expect(e).toEvaluate(
					COTISATION,
					Math.round(
						3 * PASSProratisé * TAUX1_T5 + (5_000 - 3 * PASSProratisé) * TAUX2
					)
				)
			})
		})

		describe('pour les DROM', () => {
			it('applique un taux fixe de 8,5% en cas d’assiette sociale inférieure à 3 PASS', () => {
				const e = engine.setSituation({
					'établissement . commune . département . outre-mer': 'oui',
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux 1`,
					100 * TAUX1_T5
				)
				expect(e).toEvaluate(COTISATION, Math.round(60_000 * TAUX1_T5))
			})
		})

		describe('en cas de domiciliation fiscale à l’étranger', () => {
			it('applique un taux de 14,5%', () => {
				const e = engine.setSituation({
					"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(COTISATION, Math.round((60_000 * 14.5) / 100))
			})
		})
	})

	describe('pour les PLR', () => {
		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique le même barème que pour les artisans, commerçants et PLNR', () => {
			const plancherTaux1 = Math.round(0.2 * PASS) - 1
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale': `${plancherTaux1} €/an`,
			})

			expect(e1).toEvaluate(`${COTISATION} avant abattements . taux 1`, 0)
			expect(e1).toEvaluate(COTISATION, 0)

			const e2 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})
			const taux2 =
				round((100 * TAUX1_T1 * (10_000 - 0.2 * PASS)) / (0.2 * PASS), 2) / 100

			expect(e2).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux2
			)
			expect(e2).toEvaluate(COTISATION, Math.round(10_000 * taux2))

			const e3 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'23000 €/an',
			})
			const taux3 =
				round(
					100 *
						(TAUX1_T1 +
							((TAUX1_T2 - TAUX1_T1) * (23_000 - 0.4 * PASS)) / (0.2 * PASS)),
					2
				) / 100

			expect(e3).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux3
			)
			expect(e3).toEvaluate(COTISATION, Math.round(23_000 * taux3))

			const e4 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
			})
			const taux4 =
				round(
					100 *
						(TAUX1_T2 +
							((TAUX1_T3 - TAUX1_T2) * (40_000 - 0.6 * PASS)) / (0.5 * PASS)),
					2
				) / 100

			expect(e4).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux4
			)
			expect(e4).toEvaluate(COTISATION, Math.round(40_000 * taux4))

			const e5 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})
			const taux5 =
				round(
					100 *
						(TAUX1_T3 +
							((TAUX1_T4 - TAUX1_T3) * (60_000 - 1.1 * PASS)) / (0.9 * PASS)),
					2
				) / 100

			expect(e5).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux5
			)
			expect(e5).toEvaluate(COTISATION, Math.round(60_000 * taux5))

			const e6 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})
			const taux6 =
				round(
					100 *
						(TAUX1_T4 +
							((TAUX1_T5 - TAUX1_T4) * (100_000 - 2 * PASS)) / (1 * PASS)),
					2
				) / 100

			expect(e6).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * taux6
			)
			expect(e6).toEvaluate(COTISATION, Math.round(100_000 * taux6))

			const e7 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e7).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * TAUX1_T5
			)
			expect(e7).toEvaluate(
				COTISATION,
				Math.round(3 * PASS * TAUX1_T5 + (150_000 - 3 * PASS) * TAUX2)
			)
		})

		it('applique un taux de 14,5% en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				...defaultSituation,
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e).toEvaluate(COTISATION, Math.round((60_000 * 14.5) / 100))
		})

		it('applique un barème différent avant la réforme', () => {
			const TAUX_T1 = 4 / 100
			const TAUX_T2 = 6.5 / 100

			const e = engine.setSituation({
				...defaultSituation,
				date: '01/01/2024',
			})
			const PASS2024 = e.evaluate('plafond sécurité sociale . annuel')
				.nodeValue as number
			const plancherTaux1 = Math.round(0.4 * PASS2024) - 1

			const e1 = engine.setSituation({
				...defaultSituation,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale': `${plancherTaux1} €/an`,
			})

			expect(e1).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie . taux',
				0
			)
			expect(e1).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie',
				0
			)
			expect(e1).toEvaluate(COTISATION, 0)

			const e2 = engine.setSituation({
				...defaultSituation,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'25000 €/an',
			})
			const taux2 =
				round(
					(100 * TAUX_T1 * (25_000 - 0.4 * PASS2024)) / (0.2 * PASS2024),
					2
				) / 100
			const cotisation2 = Math.round(25_000 * taux2)

			expect(e2).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie . taux',
				100 * taux2
			)
			expect(e2).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie',
				cotisation2
			)
			expect(e2).toEvaluate(COTISATION, cotisation2)

			const e3 = engine.setSituation({
				...defaultSituation,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})
			const taux3 =
				round(
					100 *
						(TAUX_T1 +
							((TAUX_T2 - TAUX_T1) * (50_000 - 0.6 * PASS2024)) /
								(0.5 * PASS2024)),
					2
				) / 100
			const cotisation3 = Math.round(50_000 * taux3)

			expect(e3).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie . taux',
				100 * taux3
			)
			expect(e3).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie',
				cotisation3
			)
			expect(e3).toEvaluate(COTISATION, cotisation3)

			const e4 = engine.setSituation({
				...defaultSituation,
				date: '01/01/2024',
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})
			const cotisation4 = Math.round(100_000 * TAUX_T2)

			expect(e4).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie . taux',
				100 * TAUX_T2
			)
			expect(e4).toEvaluate(
				'indépendant . profession libérale . CNAVPL . maladie',
				cotisation4
			)
			expect(e4).toEvaluate(COTISATION, cotisation4)
		})

		it('applique un taux fixe de 8,5% en cas d’assiette sociale inférieure à 3 PASS pour les DROM', () => {
			const e = engine.setSituation({
				'établissement . commune . département . outre-mer': 'oui',
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e).toEvaluate(
				`${COTISATION} avant abattements . taux 1`,
				100 * TAUX1_T5
			)
			expect(e).toEvaluate(COTISATION, Math.round(60_000 * TAUX1_T5))
		})
	})
})
