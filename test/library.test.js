import { expect } from 'chai'
import evaluate from '../source/engine/index'
import { propEq } from 'ramda'

describe('library', function() {
	it('should evaluate one target with no input data', function() {
		let target = 'contrat salarié . salaire . net'
		let evaluated = evaluate([target], {
			'contrat salarié': { salaire: { 'brut de base': 2300 } }
		})
		let evaluatedTarget = evaluated.targets.find(propEq('dottedName', target))
		expect(evaluatedTarget)
			.to.have.property('nodeValue')
			.to.be.within(1779, 1780)
	})
})
