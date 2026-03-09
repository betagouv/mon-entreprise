import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { round } from '@/utils/number'

const COTISATION =
	'indépendant . cotisations et contributions . cotisations . allocations familiales'

const TAUX = 3.1 / 100

describe('Cotisation allocations familiales', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('applique un taux nul en cas d’assiette sociale inférieure à 110% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} avant abattements . taux`, 0)
			expect(e).toEvaluate(COTISATION, 0)
		})

		it('applique un taux progressif compris entre 0% et 3,10% en cas d’assiette sociale comprise entre 110% et 140% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			const taux =
				round((100 * TAUX * (60_000 - 1.1 * PASS)) / (0.3 * PASS), 2) / 100

			expect(e).toEvaluate(`${COTISATION} avant abattements . taux`, 100 * taux)
			expect(e).toEvaluate(COTISATION, Math.round(60_000 * taux))
		})

		it('applique un taux de 3,10% en cas d’assiette sociale supérieure à 140% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} avant abattements . taux`, 100 * TAUX)
			expect(e).toEvaluate(COTISATION, Math.round(70_000 * TAUX))
		})

		describe('en cas d’année incomplète', () => {
			it('applique un taux nul en cas d’assiette sociale annualisée inférieure à 110% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '355 jour',
				})

				expect(e).toEvaluate(`${COTISATION} avant abattements . taux`, 0)
				expect(e).toEvaluate(COTISATION, 0)
			})

			it('applique un taux progressif compris entre 0% et 3,10% en cas d’assiette sociale annualisée comprise entre 110% et 140% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '304 jour',
				})

				const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				const taux =
					round(
						(100 * TAUX * (50_000 - 1.1 * PASSProratisé)) /
							(0.3 * PASSProratisé),
						2
					) / 100

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux`,
					100 * taux
				)
				expect(e).toEvaluate(COTISATION, Math.round(50_000 * taux))
			})

			it('applique un taux de 3,10% en cas d’assiette sociale annualisée supérieure à 140% du PASS', () => {
				const e = engine.setSituation({
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
					"entreprise . durée d'activité cette année": '260 jour',
				})

				expect(e).toEvaluate(
					`${COTISATION} avant abattements . taux`,
					100 * TAUX
				)
				expect(e).toEvaluate(COTISATION, Math.round(50_000 * TAUX))
			})
		})

		it('applique un taux fixe de 3,1% pour les DROM', () => {
			const situation = {
				'établissement . commune . département . outre-mer': 'oui',
			}

			const e1 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e1).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e1).toEvaluate(COTISATION, Math.round(50_000 * TAUX))

			const e2 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e2).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e2).toEvaluate(COTISATION, Math.round(60_000 * TAUX))

			const e3 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e3).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e3).toEvaluate(COTISATION, Math.round(70_000 * TAUX))
		})
	})

	describe('pour les PLR', () => {
		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique le même barème que pour les artisans, commerçants et PLNR', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e1).toEvaluate(`${COTISATION} avant abattements . taux`, 0)
			expect(e1).toEvaluate(COTISATION, 0)

			const e2 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})
			const taux2 =
				round((100 * TAUX * (60_000 - 1.1 * PASS)) / (0.3 * PASS), 2) / 100

			expect(e2).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * taux2
			)
			expect(e2).toEvaluate(COTISATION, Math.round(60_000 * taux2))

			const e3 = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e3).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e3).toEvaluate(COTISATION, Math.round(70_000 * TAUX))
		})

		it('applique un taux fixe de 3,1% dans les DROM', () => {
			const situation = {
				...defaultSituation,
				'établissement . commune . département . outre-mer': 'oui',
			}

			const e1 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e1).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e1).toEvaluate(COTISATION, Math.round(50_000 * TAUX))

			const e2 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'60000 €/an',
			})

			expect(e2).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e2).toEvaluate(COTISATION, Math.round(60_000 * TAUX))

			const e3 = engine.setSituation({
				...situation,
				'indépendant . cotisations et contributions . assiette sociale':
					'70000 €/an',
			})

			expect(e3).toEvaluate(
				`${COTISATION} avant abattements . taux`,
				100 * TAUX
			)
			expect(e3).toEvaluate(COTISATION, Math.round(70_000 * TAUX))
		})
	})
})
