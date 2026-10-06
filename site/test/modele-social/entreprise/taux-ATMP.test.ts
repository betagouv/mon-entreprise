import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('établissement . taux ATMP . taux collectif', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('vaut le taux moyen quand aucun code risque n’est choisi', () => {
		const e = engine.setSituation({ date: '01/01/2026' })

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 2.08)
	})

	it('vaut le taux net du code risque choisi', () => {
		const e = engine.setSituation({
			'établissement . code risque': "'code 27-1ZF'",
		})

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 6.34)
	})

	it('ne tronque pas les décimales du taux net', () => {
		const e = engine.setSituation({
			'établissement . code risque': "'code 55-3AC'",
		})

		expect(e).toEvaluate('établissement . taux ATMP . taux collectif', 1.78)
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
