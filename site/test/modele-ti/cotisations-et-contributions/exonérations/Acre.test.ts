import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	'entreprise . date de création': '18/02/2026',
	'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
	'indépendant . cotisations et contributions . assiette sociale': '30000 €/an',
}

// TODO: mettre à jour une fois le calcul de l'Acre corrigé
describe.skip('L’exonération Acre', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('est complète lorsque l’assiette sociale est inférieure à 75% du PASS', () => {
		const e = engine.setSituation(defaultSituation)

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Acre . taux',
			100
		)
	})

	it('est partielle lorsque l’assiette sociale est comprise entre 75% du PASS et le PASS', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'indépendant . cotisations et contributions . assiette sociale':
				'40000 €/an',
		})
		const taux = Math.round(
			e.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . taux'
			).nodeValue as number
		)

		expect(taux).toBeLessThan(100)
		expect(taux).toBeGreaterThan(0)
	})

	it('est nulle lorsque l’assiette sociale est supérieure au PASS', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'indépendant . cotisations et contributions . assiette sociale':
				'50000 €/an',
		})

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Acre . taux',
			0
		)
	})

	it('est proratisée en fonction de la durée d’application sur l’année en cours', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'entreprise . date de création': '18/02/2025',
		})

		const prorata = e.evaluate(
			"indépendant . cotisations et contributions . cotisations . exonérations . Acre . prorata sur l'année"
		).nodeValue as number

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération',
			Math.round(prorata)
		)
	})

	describe('pour les A/C/PLNR', () => {
		it('s’applique à la cotisation maladie-maternité', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité',
				0
			)
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières',
				0
			)
		})

		it('s’applique à la cotisation allocations familiales', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				0
			)
		})

		it('s’applique à la cotisation retraite de base', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				0
			)
		})

		it('s’applique à la cotisation invalidité et décès', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				0
			)
		})
	})

	describe('pour les PLR Cipav', () => {
		const defaultSituationCipav = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}
		it('s’applique à la cotisation maladie-maternité', () => {
			const e = engine.setSituation(defaultSituationCipav)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité',
				0
			)
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e = engine.setSituation(defaultSituationCipav)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières',
				0
			)
		})

		it('s’applique à la cotisation allocations familiales', () => {
			const e = engine.setSituation(defaultSituationCipav)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				0
			)
		})

		it('s’applique à la cotisation retraite de base', () => {
			const e = engine.setSituation(defaultSituationCipav)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				0
			)
		})

		it('s’applique à la cotisation invalidité et décès', () => {
			const e = engine.setSituation(defaultSituationCipav)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				0
			)
		})
	})

	describe('pour les PLR non Cipav', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . profession libérale . réglementée . métier':
				"'expert-comptable'",
		}

		it('s’applique à la cotisation maladie-maternité', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité',
				0
			)
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières',
				0
			)
		})

		it('s’applique à la cotisation allocations familiales', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . allocations familiales',
				0
			)
		})

		it('s’applique à la cotisation retraite de base', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				0
			)
		})

		it('s’applique à la cotisation retraite de base après la participation CPAM pour les médecins', () => {
			const e1 = engine.setSituation({
				'plafond sécurité sociale': '47100 €/an',
				'entreprise . imposition': "'IR'",
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
			})
			const retraitePLR = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation({
				'plafond sécurité sociale': '47100 €/an',
				'entreprise . imposition': "'IR'",
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
				'indépendant . profession libérale . réglementée . métier':
					"'santé . médecin'",
			})
			const retraiteMédecin = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			expect(retraiteMédecin).toBeLessThan(retraitePLR)

			const e3 = engine.setSituation({
				'plafond sécurité sociale': '47100 €/an',
				'entreprise . imposition': "'IR'",
				'indépendant . cotisations et contributions . assiette sociale':
					'40000 €/an',
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
				'indépendant . profession libérale . réglementée . métier':
					"'santé . médecin'",
				'entreprise . date de création': '18/02/2025',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
					'oui',
			})
			const exonération = e3.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number

			expect(e3).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				Math.round(retraiteMédecin * (1 - exonération / 100))
			)
		})

		it('s’applique à la cotisation invalidité et décès', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				0
			)
		})
	})
})
