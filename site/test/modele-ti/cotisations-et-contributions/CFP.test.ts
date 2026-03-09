import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATION =
	'indépendant . cotisations et contributions . formation professionnelle'

describe('Contribution à la formation professionnelle', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('vaut 0,25% du PASS pour le cas général', () => {
			expect(engine).toEvaluate(`${COTISATION} . taux`, 0.25)
			expect(engine).toEvaluate(COTISATION, Math.round((PASS * 0.25) / 100))
		})

		it('vaut 0,34% du PASS avec conjoint collaborateur', () => {
			const e = engine.setSituation({
				'indépendant . conjoint collaborateur': 'oui',
			})

			expect(e).toEvaluate(`${COTISATION} . taux`, 0.34)
			expect(e).toEvaluate(COTISATION, Math.round((PASS * 0.34) / 100))
		})

		it('vaut 0,29% du PASS pour les activités artisanales', () => {
			const e = engine.setSituation({
				'entreprise . activité': "'artisanale'",
			})

			expect(e).toEvaluate(`${COTISATION} . taux`, 0.29)
			expect(e).toEvaluate(COTISATION, Math.round((PASS * 0.29) / 100))
		})

		it('n’est pas proratisée en cas d’année incomplète', () => {
			const annéeComplète = engine.evaluate(COTISATION).nodeValue

			const e = engine.setSituation({
				"entreprise . durée d'activité cette année": '250 jour',
			})
			const annéeIncomplète = e.evaluate(COTISATION).nodeValue

			expect(annéeIncomplète).toEqual(annéeComplète)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('vaut 0,25% du PASS', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(`${COTISATION} . taux`, 0.25)
			expect(e).toEvaluate(COTISATION, Math.round((PASS * 0.25) / 100))
		})

		it('vaut 0,34% du PASS avec conjoint collaborateur', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . conjoint collaborateur': 'oui',
			})

			expect(e).toEvaluate(`${COTISATION} . taux`, 0.34)
			expect(e).toEvaluate(COTISATION, Math.round((PASS * 0.34) / 100))
		})
	})
})
