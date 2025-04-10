import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { SituationPublicodes } from '@/domaine/SituationPublicodes'

const situationParDéfaut = {} satisfies SituationPublicodes

describe('Économie collaborative', () => {
	describe('Location de meublé', () => {
		describe('Courte durée', () => {
			let engine: Engine<DottedName>
			beforeEach(() => {
				engine = new Engine(rules, {
					logger: {
						// eslint-disable-next-line no-console
						log: console.log,
						warn() {},
						// eslint-disable-next-line no-console
						error: console.error,
					},
				})
			})

			it('applique correctement l’abattement et le taux de cotisation', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '40000 €/an',
				})

				expect(e).toEvaluate(
					'location de logement meublé . cotisations',
					7587.2
				)
			})

			it('prend en compte le taux de cotisation spécial pour le Bas-Rhin, le Haut-Rhin et la Moselle', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '40000 €/an',
					'location de logement meublé . zone géographique': "'Alsace-Moselle'",
				})

				const cotisations = e.evaluate(
					'location de logement meublé . cotisations'
				).nodeValue

				expect(cotisations).toEqual(7_795.2)
			})

			it('applique le régime général jusqu’à 77 700 €', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '77700 €/an',
				})
				expect(e).toBeApplicable('location de logement meublé . cotisations')
			})
			it('n’applique pas le régime général si plus de 77 700 €', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '77701 €/an',
				})

				expect(e).not.toBeApplicable(
					'location de logement meublé . cotisations'
				)
			})
			it('ne compte aucune cotisation en-dessous de 23 000 € de recettes', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '22000 €/an',
				})

				expect(e).toEvaluate('location de logement meublé . cotisations', 0)
			})
			it('ne compte pas les 23 000 premiers € de recettes la première année', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '24000 €/an',
					"location de logement meublé . date de début d'activité":
						'01/02/2025',
				})

				const cotisations = e.evaluate(
					'location de logement meublé . cotisations'
				).nodeValue

				expect(cotisations).toBeLessThan(24_000 - 23_000)
			})
			it('reconnait quand les recettes dépassent les autres revenus', () => {
				engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '35000 €/an',
					'location de logement meublé . autres revenus': '30000 €/an',
				})

				expect(engine).toEvaluate(
					'location de logement meublé . recettes supérieures aux autres revenus',
					true
				)
			})
			it('reconnait quand les recettes ne dépassent pas les autres revenus', () => {
				engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '25000 €/an',
					'location de logement meublé . autres revenus': '30000 €/an',
				})

				expect(engine).toEvaluate(
					'location de logement meublé . recettes supérieures aux autres revenus',
					false
				)
			})
			it('applique le régime général par défaut', () => {
				engine.setSituation({
					...situationParDéfaut,
				})

				expect(engine).toEvaluate(
					'location de logement meublé . affiliation',
					'RG'
				)
			})
			it.skip('applique le régime TI si choisi', () => {
				engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '25000 €/an',
					'location de logement meublé . affiliation': "'TI'",
				})

				expect(engine).toEvaluate(
					'location de logement meublé . cotisations',
					10_064
				)
			})
			it('applique le régime ME si choisi', () => {
				engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '25000 €/an',
					'location de logement meublé . affiliation': "'ME'",
				})

				expect(engine).toEvaluate(
					{
						valeur: 'location de logement meublé . cotisations',
						unité: '€/an',
					},
					3_100
				)
			})
		})
	})
})
