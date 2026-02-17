import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	'entreprise . activité': "'libérale'",
	'entreprise . activité . libérale . réglementée': 'oui',
	'entreprise . date de création': '18/02/2025',
	'indépendant . cotisations et contributions . assiette sociale': '36000 €/an',
}
const defaultSituationAvecExonérations = {
	...defaultSituation,
	'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
	'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
		'oui',
}

// TODO: mettre à jour une fois le calcul de l'Acre corrigé
describe.skip('L’exonération appliquée', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('à la cotisation maladie-maternité', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'1 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(acre).toBeGreaterThan(invalidité)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - acre / 100))
			)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(invalidité).toBeGreaterThan(acre)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - invalidité / 100))
			)
		})
	})

	describe('à la cotisation indemnités journalières', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'1 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(acre).toBeGreaterThan(invalidité)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - acre / 100))
			)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(invalidité).toBeGreaterThan(acre)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - invalidité / 100))
			)
		})
	})

	describe('à la cotisation retraite de base', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'1 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(acre).toBeGreaterThan(invalidité)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - acre / 100))
			)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
			})
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue

			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number

			expect(invalidité).toBeGreaterThan(acre)

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - invalidité / 100))
			)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base',
				0
			)
		})
	})

	describe('à la cotisation retraite complémentaire', () => {
		it('est l’exonération invalidité lorsqu’il n’y a pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
			})
			const invalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération'
			).nodeValue as number
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - invalidité / 100))
			)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'1 mois',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				0
			)
		})
	})

	describe('à la cotisation invalidité-décès', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationAvecExonérations)
			const acre = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération'
			).nodeValue as number
			const cotisationExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès'
			).nodeValue

			expect(cotisationExonérée).toEqual(
				Math.round(cotisation * (1 - acre / 100))
			)
		})

		it('est l’exonération âge lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'11 mois',
				'indépendant . cotisations et contributions . cotisations . exonérations . âge':
					'oui',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				0
			)
		})
	})
})
