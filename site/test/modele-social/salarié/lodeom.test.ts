import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { configLodeom } from '@/pages/simulateurs/lodeom/simulationConfig'

const situationParDéfaut = {
	...configLodeom.situation,
	'salarié . rémunération . brut': '3500 €/mois',
}
const situationZone1 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
}
const situationMayotte = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'mayotte'",
	'salarié . rémunération . brut': '3000 €/mois',
}
const situationZone2 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone deux'",
}

describe('Lodeom', () => {
	let engine: Engine<RègleModèleSocial>
	let smic: number
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Calcul de la réduction et de sa répartition', () => {
		describe('Zone un', () => {
			// T = 0,3201
			// Smic (1er janvier) = 1823,07
			// Réduction = 3500 x cœefficient
			it.each([
				// Cœfficient = (1,3 x 0,3201 / 0,9) x [(2,2 * 1823,07 / 3500) - 1] = 0,0675
				['compétitivité', 236.25, 44.36, 191.89, 29.52],
				// Cœfficient = T = 0,3201
				['compétitivité renforcée', 1120.35, 210.35, 910, 140.0],
				// Cœfficient = 1,7 * 0,3201 * 1823,07 / 3500 = 0,2834
				['innovation et croissance', 991.9, 186.23, 805.67, 123.95],
			])(
				'Barème %s',
				(barème, montantLodeom, montantIRC, montantUrssaf, montantChômage) => {
					const e = engine.setSituation({
						...situationZone1,
						'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
					})

					expect(e).toEvaluate(
						{
							valeur: 'salarié . cotisations . exonérations . lodeom . montant',
							arrondi: '2 décimales',
						},
						montantLodeom
					)
					expect(e).toEvaluate(
						{
							valeur:
								'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
							arrondi: '2 décimales',
						},
						montantIRC
					)
					expect(e).toEvaluate(
						{
							valeur:
								'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
							arrondi: '2 décimales',
						},
						montantUrssaf
					)
					expect(e).toEvaluate(
						{
							valeur:
								'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
							arrondi: '2 décimales',
						},
						montantChômage
					)
				}
			)
		})

		describe('Mayotte', () => {
			// T = 0,1996
			// Smic (1er juin) = 1449,93
			// Réduction = 3000 x cœefficient
			it.each([
				// Cœfficient = (1,3 x 0,1996 / 0,9) x [(2,2 * 1449,93 / 3000) - 1] = 0,0182
				['compétitivité', 54.6, 7.66],
				// Cœfficient = (2 x 0,1996 / 0,7) x [(2,7 * 1449,93 / 3000) - 1] = 0,1739
				['compétitivité renforcée', 521.7, 73.18],
				// Cœfficient = 1,7 * 0,1996 * 1449,93 / 3000 = 0,1640
				['innovation et croissance', 492, 69.02],
			])('Barème %s', (barème, montantLodeom, montantChômage) => {
				const e = engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					montantLodeom
				)
				expect(e).not.toBeApplicable(
					'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire'
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						arrondi: '2 décimales',
					},
					montantLodeom
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						arrondi: '2 décimales',
					},
					montantChômage
				)
			})
		})

		describe('Zone deux', () => {
			// T = 0,2111
			// Smic (1er janvier) = 1823,07
			// Réduction = 3500 x cœefficient
			it.each([
				// Cœfficient = 1,4 * 0,2111 * 1823,07 / 3500 = 0,1539
				['moins de 11 salariés', 538.65],
				// Cœfficient = (1,4 x 0,2111 / 1,6) x [(3 * 1823,07 / 3500) - 1] = 0,1039
				['sectoriel', 363.65],
				// Cœfficient = 1,7 * 0,2111 * 1823,07 / 3500 = 0,1869
				['renforcé', 654.15],
			])('Barème %s', (barème, montantLodeom) => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					montantLodeom
				)
			})
		})
	})

	describe('Salaire trop élevé', () => {
		describe('Zone un', () => {
			beforeEach(() => {
				smic = engine.evaluate('SMIC').nodeValue as number
			})

			it.each([
				['compétitivité', 2.2],
				['compétitivité renforcée', 2.7],
				['innovation et croissance', 3.5],
			])('Barème %s', (barème, seuil) => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
					'salarié . rémunération . brut': `${Math.ceil(seuil * smic)} €/mois`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})
		})

		describe('Mayotte', () => {
			beforeEach(() => {
				smic = engine.evaluate({
					valeur: 'SMIC',
					contexte: {
						'établissement . commune . département': "'Mayotte'",
					},
				}).nodeValue as number
			})

			it.each([
				['compétitivité', 2.2],
				['compétitivité renforcée', 2.7],
				['innovation et croissance', 3.5],
			])('Barème %s', (barème, seuil) => {
				const e = engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
					'salarié . rémunération . brut': `${Math.ceil(seuil * smic)} €/mois`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})
		})

		describe('Zone deux', () => {
			beforeEach(() => {
				smic = engine.evaluate('SMIC').nodeValue as number
			})

			it.each([
				['moins de 11 salariés', 3],
				['sectoriel', 3],
				['renforcé', 4.5],
			])('Barème %s', (barème, seuil) => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes': `"${barème}"`,
					'salarié . rémunération . brut': `${Math.ceil(seuil * smic)} €/mois`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})
		})
	})

	describe('Plus de 50 salariés', () => {
		describe('Zone un', () => {
			// T = 0,3241
			// Smic (1er janvier) = 1823,07
			// Réduction = 3500 x cœefficient
			it.each([
				// Cœfficient = (1,3 x 0,3241 / 0,9) x [(2,2 * 1823,07 / 3500) - 1] = 0,0683
				['compétitivité', 239.05],
				// Cœfficient = T = 0,3241
				['compétitivité renforcée', 1134.35],
				// Cœfficient = 1,7 * 0,3241 * 1823,07 / 3500 = 0,2870
				['innovation et croissance', 1004.5],
			])('Barème %s', (barème, montantLodeom) => {
				const e = engine.setSituation({
					...situationZone1,
					'entreprise . salariés . effectif': '50',
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					montantLodeom
				)
			})
		})

		describe('À Mayotte', () => {
			// T = 0,2036
			// Smic (1er juin) = 1449,93
			// Réduction = 3000 x cœefficient
			it.each([
				// Cœfficient = (1,3 x 0,2036 / 0,9) x [(2,2 * 1449,93 / 3000) - 1] = 0,0186
				['compétitivité', 55.8],
				// Cœfficient = (2 x 0,2036 / 0,7) x [(2,7 * 1449,93 / 3000) - 1] = 0,1774
				['compétitivité renforcée', 532.2],
				// Cœfficient = 1,7 * 0,2036 * 1449,93 / 3000 = 0,1673
				['innovation et croissance', 501.9],
			])('Barème %s', (barème, montantLodeom) => {
				const e = engine.setSituation({
					...situationMayotte,
					'entreprise . salariés . effectif': '50',
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					montantLodeom
				)
			})
		})
	})
})
