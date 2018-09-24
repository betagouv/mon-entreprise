import { expect } from 'chai'
import Syso from '../source/engine/index'
import { propEq } from 'ramda'
import dedent from 'dedent-js'
console.log(Syso)

describe('library', function() {
	it('should evaluate one target with no input data', function() {
		let target = 'contrat salarié . salaire . net'
		let evaluated = Syso.evaluate([target], {
			'contrat salarié': { salaire: { 'brut de base': 2300 } }
		})
		let evaluatedTarget = evaluated.targets.find(propEq('dottedName', target))
		expect(evaluatedTarget)
			.to.have.property('nodeValue')
			.to.be.within(1779, 1780)
	})

	it('should let the user replace the default rules', function() {
		let newRules = `
- nom: yo
  formule: 90890
- nom: ya
  formule:  yo + 1
`

		let evaluated = Syso.evaluate(['ya'], {}, newRules)

		expect(evaluated.targets[0].nodeValue).to.equal(90891)
	})
})
