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
			it.each([
				['compétitivité', 280.7, 52.7, 228, 35.08],
				['compétitivité renforcée', 1120.35, 210.35, 910, 140.0],
				['innovation et croissance', 1016.05, 190.77, 825.28, 126.97],
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
			it.each([
				['compétitivité', 54.6, 10.94],
				['compétitivité renforcée', 521.7, 104.55],
				['innovation et croissance', 492, 98.6],
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
			it.each([
				['moins de 11 salariés', 551.95],
				['sectoriel', 388.15],
				['renforcé', 669.9],
			])('Barème %s', (barème, montantLodeom) => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
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
			const situationModifiée = {
				...situationZone1,
				'entreprise . salariés . effectif': '50',
			}

			it.each([
				['compétitivité', 284.2],
				['compétitivité renforcée', 1134.35],
				['innovation et croissance', 1028.65],
			])('Barème %s', (barème, montantLodeom) => {
				const e = engine.setSituation({
					...situationModifiée,
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
