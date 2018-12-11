import { expect } from 'chai'
import { getSituationValue } from '../source/engine/variables'

describe('getSituationValue', function() {
	it("should interpret rules with 'oui' for true", function() {
		let rule = { name: 'condition' },
			state = { condition: 'oui' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'condition', rule)).to.be.true
	})
	it('should directly return the value of any rule that specifies a format (i.e currency, duration)', function() {
		let rule = { format: 'euros' },
			state = { salaire: '2300' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'salaire', rule)).to.equal('2300')
	})

	it("should interpret rules without a formula as boolean-valued, with 'oui' for true", function() {
		let rule = {},
			state = { condition: 'oui' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'condition', rule)).to.be.true
	})

	it("should interpret rules without a formula as boolean-valued, with 'non' meaning false", function() {
		let rule = {},
			state = { condition: 'non' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'condition', rule)).to.be.false
	})
})
