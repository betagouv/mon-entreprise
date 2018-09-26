import { expect } from 'chai'
import Syso from '../source/engine/index'
import { propEq } from 'ramda'
import sasuRules from '../source/règles/sasu.yaml'

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
		let rules = `
- nom: yo
  formule: 90890
- nom: ya
  formule:  yo + 1
`

		let evaluated = Syso.evaluate(['ya'], {}, { base: rules })

		expect(evaluated.targets[0].nodeValue).to.equal(90891)
	})
	it('should let the user add rules to the default ones', function() {
		let rules = `
- nom: yo
  formule: 1
- nom: ya
  formule:  contrat salarié . salaire . net + yo
`

		let evaluated = Syso.evaluate(
			['ya'],
			{
				'contrat salarié . salaire . brut de base': 2300
			},
			{ extra: rules }
		)

		expect(evaluated.targets[0].nodeValue).to.be.closeTo(1780.41, 1)
	})
	it('should let the user extend the rules constellation in a serious manner', function() {
		let evaluated = Syso.evaluate(
			['salaire total'],
			{
				'chiffre affaires': 5000
			},
			{ extra: sasuRules }
		)

		expect(evaluated.targets[0].nodeValue).to.be.closeTo(1500, 1)
	})
})
