import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Économie collaborative', () => {
	describe('Location de meublé', () => {
		describe('Courte durée', () => {
			let engine: Engine<DottedName>
			beforeEach(() => {
				engine = new Engine(rules)
			})

			it('applique correctement l’abattement et le taux de cotisation', () => {
				const e = engine.setSituation({
					'location de logement meublé . courte durée . recettes': '40000 €/an',
				})
				expect(e).toEvaluate(
					'location de logement meublé . cotisations',
					7587.2
				)
			})

			it('applique le régime général jusqu’à 77 700 €', () => {
				const e = engine.setSituation({
					'location de logement meublé . courte durée . recettes': '77700 €/an',
				})
				expect(e).toBeApplicable('location de logement meublé . cotisations')
			})
			it('n’applique pas le régime général si plus de 77 700 €', () => {
				const e = engine.setSituation({
					'location de logement meublé . courte durée . recettes': '77701 €/an',
				})

				expect(e).not.toBeApplicable(
					'location de logement meublé . cotisations'
				)
			})
			it('ne compte aucune cotisation en-dessous de 23 000 € de recettes', () => {
				const e = engine.setSituation({
					'location de logement meublé . courte durée . recettes': '22000 €/an',
				})

				expect(e).toEvaluate('location de logement meublé . cotisations', 0)
			})
		})
	})
})
