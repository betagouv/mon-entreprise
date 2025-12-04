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

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					18840
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					94
				)
			})

			it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 5 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
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

			it('applique une assiette maximale égale à 5 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationCessation,
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

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . PL . régime général': 'non',
		}

		it('applique un taux de 0,3%', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . taux',
				0.3
			)
		})

		it('applique une assiette minimale égale à 40% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				18840
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				57
			)
		})

		it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 3 PASS non proratisé', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				30000
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				90
			)
		})

		it('applique une assiette maximale égale à 3 PASS', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette sociale':
					'150000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
				141300
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
				424
			)
		})

		describe('en cas d’année incomplète', () => {
			const defaultSituationPLRCessation = {
				...defaultSituationPLR,
				"entreprise . en cessation d'activité": 'oui',
				'entreprise . date de cessation': '01/06/2025',
			}

			it('applique une assiette minimale égale à 40% du PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationPLRCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					18840
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					57
				)
			})

			it('applique l’assiette sociale lorsqu’elle est comprise entre 40% et 3 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationPLRCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					30000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					90
				)
			})

			it('applique une assiette maximale égale à 3 PASS non proratisé', () => {
				const e = engine.setSituation({
					...defaultSituationPLRCessation,
					'indépendant . cotisations et contributions . assiette sociale':
						'300000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					141300
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					424
				)
			})
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
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					3
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
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières',
					3
				)
			})
		})
	})
})
