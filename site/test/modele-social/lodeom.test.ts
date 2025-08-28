import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { configLodeom } from '@/pages/simulateurs/lodeom/simulationConfig'

const situationParDéfaut = {
	...configLodeom.situation,
	'salarié . cotisations . assiette': '3500 €/mois',
}
const situationZone1 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
}
const situationZone2 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone deux'",
}

describe('Lodeom', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Calcul de la réduction et de sa répartition', () => {
		describe('Zone un', () => {
			it('Barème compétitivité', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					213.85
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						arrondi: '2 décimales',
					},
					40.25
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						arrondi: '2 décimales',
					},
					173.6
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						arrondi: '2 décimales',
					},
					26.79
				)
			})

			it('Barème compétitivité renforcée', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité renforcée'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					1117.55
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						arrondi: '2 décimales',
					},
					210.35
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						arrondi: '2 décimales',
					},
					907.2
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						arrondi: '2 décimales',
					},
					140.0
				)
			})

			it('Barème innovation et croissance', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'innovation et croissance'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					977.9
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						arrondi: '2 décimales',
					},
					184.06
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						arrondi: '2 décimales',
					},
					793.84
				)
				expect(e).toEvaluate(
					{
						valeur:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						arrondi: '2 décimales',
					},
					122.51
				)
			})
		})

		describe('Zone deux', () => {
			it('Barème moins de 11 salariés', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'moins de 11 salariés'",
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					530.25
				)
			})

			it('Barème sectoriel', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'sectoriel'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					350.35
				)
			})

			it('Barème renforcé', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'renforcé'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					644.0
				)
			})
		})
	})

	describe('Salaire trop élevé', () => {
		describe('Zone un', () => {
			it('Barème compétitivité', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité'",
					'salarié . cotisations . assiette': '3964 €/mois',
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})

			it('Barème compétitivité renforcée', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité renforcée'",
					'salarié . cotisations . assiette': '4865 €/mois',
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})

			it('Barème innovation et croissance', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité'",
					'salarié . cotisations . assiette': '6307 €/mois',
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})
		})

		describe('Zone deux', () => {
			it('Barème moins de 11 salariés', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'moins de 11 salariés'",
					'salarié . cotisations . assiette': '5406 €/mois',
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})

			it('Barème sectoriel', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'sectoriel'",
					'salarié . cotisations . assiette': '5406 €/mois',
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					0
				)
			})

			it('Barème renforcé', () => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes':
						"'renforcé'",
					'salarié . cotisations . assiette': '8109 €/mois',
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

			it('Barème compétitivité', () => {
				const e = engine.setSituation({
					...situationModifiée,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité'",
				})

				expect(e).toEvaluate(
					{
						valeur: 'salarié . cotisations . exonérations . lodeom . montant',
						arrondi: '2 décimales',
					},
					216.65
				)
			})

			it('Barème compétitivité renforcée', () => {
				const e = engine.setSituation({
					...situationModifiée,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité renforcée'",
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					1131.55
				)
			})

			it('Barème innovation et croissance', () => {
				const e = engine.setSituation({
					...situationModifiée,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'innovation et croissance'",
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					990.15
				)
			})
		})
	})
})
