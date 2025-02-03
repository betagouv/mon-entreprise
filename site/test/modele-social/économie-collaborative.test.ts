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
					'location de logement . meublé . loyer . net': '40000 €',
				})
				expect(e).toEvaluate(
					'location de logement . meublé . cotisations',
					7587.2
				)
			})
		})
	})
})
