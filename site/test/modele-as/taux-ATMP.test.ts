import rules, { RègleModèleAssimiléSalarié } from 'modele-as'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('établissement . taux ATMP . taux collectif (assimilé salarié)', () => {
	let engine: Engine<RègleModèleAssimiléSalarié>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('vaut le taux moyen quand aucun code risque n’est choisi', () => {
		const e = engine.setSituation({ date: '01/01/2026' })

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 2.08)
	})

	it('vaut le taux net du code risque choisi, sans troncature', () => {
		const e = engine.setSituation({
			'établissement . code risque': "'code 27-1ZF'",
		})

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 6.34)
	})

	it('applique par défaut au taux AT/MP le taux du code risque choisi', () => {
		const e = engine.setSituation({
			'établissement . code risque': "'code 19-2ZH'",
		})

		expect(e).toEvaluate('établissement . taux ATMP', 2.25)
	})

	it('porte le taux net sur chaque code risque, pour pouvoir l’afficher', () => {
		expect(engine).toEvaluate('établissement . code risque . code 27-1ZF', 6.34)
	})

	it('prend en compte un taux collectif saisi directement', () => {
		const e = engine.setSituation({
			'établissement . taux ATMP . taux collectif': '3%',
		})

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 3)
	})
})
