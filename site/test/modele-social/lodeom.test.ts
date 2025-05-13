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
					'salarié . cotisations . exonérations . lodeom . montant',
					213.85
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						precision: 2,
					},
					40.3
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						precision: 2,
					},
					173.55
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						precision: 2,
					},
					26.82
				)
			})

			it('Barème compétitivité renforcée', () => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'compétitivité renforcée'",
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . montant',
					1116.15
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						precision: 2,
					},
					210.35
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						precision: 2,
					},
					905.8
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						precision: 2,
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
					'salarié . cotisations . exonérations . lodeom . montant',
					976.85
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation retraite complémentaire',
						precision: 2,
					},
					184.1
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation sécurité sociale',
						precision: 2,
					},
					792.75
				)
				expect(e).toEvaluate(
					{
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant . imputation chômage',
						precision: 2,
					},
					122.53
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
						dottedName:
							'salarié . cotisations . exonérations . lodeom . montant',
						precision: 2,
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
					'salarié . cotisations . exonérations . lodeom . montant',
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
					'salarié . cotisations . exonérations . lodeom . montant',
					216.3
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
					1130.15
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
					989.1
				)
			})
		})
	})
})
