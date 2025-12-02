import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation indemnités journalières', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('en début d’activité', () => {
			it('applique une assiette forfaitaire non proratisée égale à 40% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . date de création': '31/01/2025',
					"entreprise . chiffre d'affaires": '10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					18840
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					94
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			it('applique une assiette minimale égale à 40% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					18840
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					94
				)
			})

			it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 5 PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					30000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					150
				)
			})

			it('applique une assiette maximale égale à 5 PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'300000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					235500
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					1178
				)
			})
		})

		it('applique un taux de 0,5%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . taux',
				0.5
			)
		})

		it('applique une assiette minimale égale à 40% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				18840
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				94
			)
		})

		it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				30000
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				150
			)
		})

		it('applique une assiette maximale égale à 5 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'300000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				235500
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				1178
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
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					5
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
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					5
				)
			})
		})
	})
})
