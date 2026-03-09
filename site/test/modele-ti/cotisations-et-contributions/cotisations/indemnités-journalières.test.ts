import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATION =
	'indépendant . cotisations et contributions . cotisations . indemnités journalières'

describe('Cotisation indemnités journalières', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		const TAUX = 0.5 / 100

		it('applique un taux de 0,5%', () => {
			expect(engine).toEvaluate(`${COTISATION} . taux`, 100 * TAUX)
		})

		it('applique une assiette minimale égale à 40% du PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . indemnités journalières'
			).nodeValue as number
			expect(assietteMinimale).toEqual(Math.round(0.4 * PASS))

			expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)

			expect(e).toEvaluate(COTISATION, Math.round(assietteMinimale * TAUX))
		})

		it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 5 PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)

			expect(e).toEvaluate(COTISATION, Math.round(30_000 * TAUX))
		})

		it('applique une assiette maximale égale à 5 PASS', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette sociale':
					'300000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 5 * PASS)

			expect(e).toEvaluate(COTISATION, Math.round(5 * PASS * TAUX))
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

		describe('en cas d’année incomplète', () => {
			const defaultSituationCessation = {
				"entreprise . en cessation d'activité": 'oui',
				'entreprise . date de cessation': '01/06/2025',
			}

			it('applique une assiette minimale égale à 40% du PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . indemnités journalières'
				).nodeValue
				expect(assietteMinimale).toEqual(Math.round(0.4 * PASS))

				expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)
			})

			it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 5 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)
			})

			it('applique une assiette maximale égale à 5 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'300000 €/an',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 5 * PASS)
			})
		})
	})

	describe('pour les PLR', () => {
		const TAUX = 0.3 / 100
		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique un taux de 0,3%', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . taux`, 100 * TAUX)
		})

		it('applique une assiette minimale égale à 40% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . indemnités journalières'
			).nodeValue as number
			expect(assietteMinimale).toEqual(Math.round(0.4 * PASS))

			expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)

			expect(e).toEvaluate(COTISATION, Math.round(assietteMinimale * TAUX))
		})

		it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 3 PASS non proratisé', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)

			expect(e).toEvaluate(COTISATION, Math.round(30_000 * TAUX))
		})

		it('applique une assiette maximale égale à 3 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e).toEvaluate(`${COTISATION} . assiette`, 3 * PASS)

			expect(e).toEvaluate(COTISATION, Math.round(3 * PASS * TAUX))
		})

		describe('en cas d’année incomplète', () => {
			const defaultSituationCessation = {
				...defaultSituation,
				"entreprise . en cessation d'activité": 'oui',
				'entreprise . date de cessation': '01/06/2025',
			}

			it('applique une assiette minimale égale à 40% du PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round(0.4 * PASS))

				expect(e).toEvaluate(`${COTISATION} . assiette`, assietteMinimale)
			})

			it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 3 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 30_000)
			})

			it('applique une assiette maximale égale à 3 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'300000 €/an',
				})

				expect(e).toEvaluate(`${COTISATION} . assiette`, 3 * PASS)
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
