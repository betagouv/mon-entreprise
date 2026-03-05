import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATIONS = 'indépendant . cotisations et contributions . cotisations'

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
describe('L’exonération appliquée', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('à la cotisation maladie-maternité', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . montant maladie-maternité':
					'100 €/an',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . montant maladie-maternité':
					'200 €/an',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . maladie-maternité`
			).nodeValue

			expect(cotisationExonérée).toEqual(cotisation - 200)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . montant maladie-maternité':
					'200 €/an',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . montant maladie-maternité':
					'100 €/an',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . maladie-maternité`
			).nodeValue

			expect(cotisationExonérée).toEqual(cotisation - 200)
		})
	})

	describe('à la cotisation indemnités journalières', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux indemnités journalières':
					'10 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux indemnités journalières':
					'20 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . indemnités journalières`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux indemnités journalières':
					'20 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux indemnités journalières':
					'10 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . indemnités journalières`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})
	})

	describe('à la cotisation retraite de base', () => {
		it('est l’Acre lorsqu’elle est plus avantageuse que l’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux retraite de base':
					'10 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux retraite de base et invalidité-décès':
					'20 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . retraite de base`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})

		it('est l’exonération invalidité lorsqu’elle est plus avantageuse que l’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux retraite de base':
					'20 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux retraite de base et invalidité-décès':
					'10 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . retraite de base`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux retraite de base':
					'10 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux retraite de base et invalidité-décès':
					'20 %',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . retraite de base`, 0)
		})
	})

	describe('à la cotisation retraite complémentaire', () => {
		it('est l’exonération invalidité lorsqu’il n’y a pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite complémentaire`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux retraite complémentaire':
					'20 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . retraite complémentaire`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . exonération . taux retraite complémentaire':
					'20 %',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . retraite complémentaire`, 0)
		})
	})

	describe('à la cotisation invalidité-décès', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux retraite de base et invalidité-décès':
					'20 %',
			})

			const cotisationExonérée = e2.evaluate(
				`${COTISATIONS} . invalidité et décès`
			).nodeValue

			expect(cotisationExonérée).toEqual(
				cotisation - Math.round(0.2 * cotisation)
			)
		})

		it('est l’exonération âge lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituationAvecExonérations,
				'indépendant . cotisations et contributions . cotisations . exonérations . Acre . exonération . taux retraite de base et invalidité-décès':
					'20 %',
				'indépendant . cotisations et contributions . cotisations . exonérations . âge':
					'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . invalidité et décès`, 0)
		})
	})
})
