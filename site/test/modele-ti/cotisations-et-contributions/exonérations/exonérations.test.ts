import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATIONS = 'indépendant . cotisations et contributions . cotisations'
const EXONÉRATIONS =
	'indépendant . cotisations et contributions . cotisations . exonérations'

const defaultSituation = {
	'entreprise . activité': "'libérale'",
	'entreprise . activité . libérale . réglementée': 'oui',
	'entreprise . date de création': '18/02/2025',
	'indépendant . cotisations et contributions . assiette sociale': '36000 €/an',
}

describe('L’exonération appliquée', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('à la cotisation maladie-maternité', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . Acre . exonération . montant maladie-maternité`]:
					'100 €/an',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				cotisation - 100
			)
		})

		it('est l’exonération invalidité lorsqu’il n’y a pas d’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . invalidité . exonération . taux maladie-maternité et indemnités journalières`]:
					'50%',
			})
			expect(e2).toEvaluate(
				`${COTISATIONS} . maladie-maternité`,
				Math.round(cotisation / 2)
			)
		})

		it('est nulle lorsqu’il y a à la fois Acre et invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . maladie-maternité`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
			})

			expect(e2).toEvaluate(`${COTISATIONS} . maladie-maternité`, cotisation)
		})
	})

	describe('à la cotisation indemnités journalières', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . Acre . exonération . taux indemnités journalières`]:
					'50 %',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				Math.round(cotisation / 2)
			)
		})

		it('est l’exonération invalidité lorsqu’il n’y a pas d’Acre', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . invalidité . exonération . taux maladie-maternité et indemnités journalières`]:
					'50%',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				Math.round(cotisation / 2)
			)
		})

		it('est nulle lorsqu’il y a à la fois Acre et invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . indemnités journalières`,
				cotisation
			)
		})
	})

	describe('à la cotisation allocations familiales', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . Acre . exonération . taux allocations familiales`]:
					'50 %',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				Math.round(cotisation / 2)
			)
		})

		it('est nulle lorsqu’il y a à la fois Acre et invalidité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . allocations familiales`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . allocations familiales`,
				cotisation
			)
		})
	})

	describe('à la cotisation retraite de base', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération invalidité ni incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . Acre . exonération . taux retraite de base et invalidité-décès`]:
					'50 %',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				Math.round(cotisation / 2)
			)
		})

		it('est l’exonération invalidité lorsqu’il n’y a pas d’Acre ni d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . invalidité . exonération . taux retraite de base`]:
					'50%',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite de base`,
				Math.round(cotisation / 2)
			)
		})

		it('est nulle lorsqu’il y a à la fois Acre et invalidité mais pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite de base`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
			})

			expect(e2).toEvaluate(`${COTISATIONS} . retraite de base`, cotisation)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . retraite de base`, 0)
		})

		it.each([
			[
				'd’Acre seule',
				{
					[`${EXONÉRATIONS} . Acre`]: 'oui',
					[`${EXONÉRATIONS} . Acre . exonération . taux retraite de base et invalidité-décès`]:
						'50 %',
				},
			],
			[
				'de pension invalidité seule',
				{
					[`${EXONÉRATIONS} . invalidité`]: 'oui',
					[`${EXONÉRATIONS} . invalidité . exonération . taux retraite de base`]:
						'50 %',
				},
			],
			[
				'd’Acre et de pension invalidité',
				{
					[`${EXONÉRATIONS} . invalidité`]: 'oui',
					[`${EXONÉRATIONS} . Acre`]: 'oui',
				},
			],
			[
				'd’exonération incapacité',
				{
					[`${EXONÉRATIONS} . invalidité`]: 'oui',
					[`${EXONÉRATIONS} . Acre`]: 'oui',
					'indépendant . profession libérale . CNAVPL . exonération incapacité':
						'oui',
				},
			],
		])(
			'est la même pour les PLR Cipav mahorais⋅es qu’en métropole en cas %s',
			(_libellé, exonérations) => {
				const enMétropole = engine
					.setSituation({ ...defaultSituation, ...exonérations })
					.evaluate(`${COTISATIONS} . retraite de base`).nodeValue as number

				expect(
					engine.setSituation({
						...defaultSituation,
						...exonérations,
						'établissement . commune . département': "'Mayotte'",
					})
				).toEvaluate(`${COTISATIONS} . retraite de base`, enMétropole)
			}
		)
	})

	describe('à la cotisation retraite complémentaire', () => {
		it('est l’exonération invalidité lorsqu’il n’y a pas d’exonération incapacité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . retraite complémentaire`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . invalidité . exonération . taux retraite complémentaire`]:
					'50%',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . retraite complémentaire`,
				Math.round(cotisation / 2)
			)
		})

		it('est l’exonération incapacité lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . invalidité . exonération . taux retraite complémentaire`]:
					'50%',
				'indépendant . profession libérale . CNAVPL . exonération incapacité':
					'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . retraite complémentaire`, 0)
		})

		it.each([
			[
				'de pension invalidité seule',
				{
					[`${EXONÉRATIONS} . invalidité`]: 'oui',
					[`${EXONÉRATIONS} . invalidité . exonération . taux retraite de base`]:
						'50 %',
				},
			],
			[
				'd’exonération incapacité',
				{
					[`${EXONÉRATIONS} . invalidité`]: 'oui',
					'indépendant . profession libérale . CNAVPL . exonération incapacité':
						'oui',
				},
			],
		])(
			'est la même pour les PLR Cipav mahorais⋅es qu’en métropole en cas %s',
			(_libellé, exonérations) => {
				const enMétropole = engine
					.setSituation({ ...defaultSituation, ...exonérations })
					.evaluate(`${COTISATIONS} . retraite complémentaire`)
					.nodeValue as number

				expect(
					engine.setSituation({
						...defaultSituation,
						...exonérations,
						'établissement . commune . département': "'Mayotte'",
					})
				).toEvaluate(`${COTISATIONS} . retraite complémentaire`, enMétropole)
			}
		)
	})

	describe('à la cotisation invalidité-décès', () => {
		it('est l’Acre lorsqu’il n’y a pas d’exonération âge', () => {
			const e1 = engine.setSituation(defaultSituation)
			const cotisation = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
				.nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . Acre . exonération . taux retraite de base et invalidité-décès`]:
					'50 %',
			})

			expect(e2).toEvaluate(
				`${COTISATIONS} . invalidité et décès`,
				Math.round(cotisation / 2)
			)
		})

		it('est l’exonération âge lorsqu’elle est présente', () => {
			const e = engine.setSituation({
				...defaultSituation,
				[`${EXONÉRATIONS} . invalidité`]: 'oui',
				[`${EXONÉRATIONS} . Acre`]: 'oui',
				[`${EXONÉRATIONS} . âge`]: 'oui',
			})

			expect(e).toEvaluate(`${COTISATIONS} . invalidité et décès`, 0)
		})

		it.each([
			[
				'd’Acre seule',
				{
					[`${EXONÉRATIONS} . Acre`]: 'oui',
					[`${EXONÉRATIONS} . Acre . exonération . taux retraite de base et invalidité-décès`]:
						'50 %',
				},
			],
			[
				'd’exonération âge',
				{
					[`${EXONÉRATIONS} . Acre`]: 'oui',
					[`${EXONÉRATIONS} . âge`]: 'oui',
				},
			],
		])(
			'est la même pour les PLR Cipav mahorais⋅es qu’en métropole en cas %s',
			(_libellé, exonérations) => {
				const enMétropole = engine
					.setSituation({ ...defaultSituation, ...exonérations })
					.evaluate(`${COTISATIONS} . invalidité et décès`).nodeValue as number

				expect(
					engine.setSituation({
						...defaultSituation,
						...exonérations,
						'établissement . commune . département': "'Mayotte'",
					})
				).toEvaluate(`${COTISATIONS} . invalidité et décès`, enMétropole)
			}
		)
	})
})
