import { expect } from 'chai'
import Syso from '../source/engine/index'
import indeps from '../source/règles/indépendants.yaml'

describe('indeps', function() {
	it('allez là', function() {
		let values = Syso.evaluate(
			['indépendants . revenu net de cotisations'],
			{ "chiffre d'affaires": 100000 },
			{
				base: indeps
			}
		)

		expect(values[0]).to.equal(201)
	})
})
