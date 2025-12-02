import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation invalidité et décès', () => {
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
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					1463
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			it('applique une assiette minimale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . assiette minimale . invalidité et décès',
					2256
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					2256
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					29
				)
			})

			it('applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre les assiettes minimale et maximale proratisées', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					10000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					130
				)
			})

			it('applique une assiette maximale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'40000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 19614)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					19614
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					255
				)
			})
		})

		it('applique une assiette minimale égale à 11,5% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . assiette minimale . invalidité et décès',
				5417
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				5417
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				70
			)
		})

		it('applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre 11,5% du PASS et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				30000
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				390
			)
		})

		it('applique une assiette maximale égale au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				47100
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				612
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
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					13
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
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					1000
				)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					13
				)
			})
		})
	})
})
