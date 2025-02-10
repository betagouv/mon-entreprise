import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { Situation } from '@/domaine/Situation'

const situationParDéfaut = {
	date: '01/01/2024à',
	"location de logement meublé . date de début d'activité": '01/01/2022',
} satisfies Situation

describe('Économie collaborative', () => {
	describe('Location de meublé', () => {
		describe('Courte durée', () => {
			let engine: Engine<DottedName>
			beforeEach(() => {
				engine = new Engine(rules)
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

			it('applique le régime général jusqu’à 77 700 €', () => {
				const e = engine.setSituation({
					...situationParDéfaut,
					'location de logement meublé . courte durée . recettes': '77700 €/an',
				})
				expect(e).toBeApplicable('location de logement meublé . cotisations')
			})
			it('n’appliquelm leblance pas le régime général si plus de 77 700 €', () => {
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
		})
	})
})
