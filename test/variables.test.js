import { expect } from 'chai'
import { evaluateBottomUp, evaluateVariable } from '../source/engine/variables'

describe('evaluateVariable', function() {
	it('should directly return the value of any rule that specifies a format (i.e currency, duration)', function() {
		let rule = { format: 'euros' },
			state = { salaire: '2300' },
			situationGate = name => state[name]

		expect(evaluateVariable(situationGate, 'salaire', rule)).to.equal('2300')
	})

	it("should interpret rules without a formula as boolean-valued, with 'oui' for true", function() {
		let rule = {},
			state = { condition: 'oui' },
			situationGate = name => state[name]

		expect(evaluateVariable(situationGate, 'condition', rule)).to.be.true
	})

	it("should interpret rules without a formula as boolean-valued, with 'non' meaning false", function() {
		let rule = {},
			state = { condition: 'non' },
			situationGate = name => state[name]

		expect(evaluateVariable(situationGate, 'condition', rule)).to.be.false
	})

	it("should interpret rules with 'one of these', with 'oui' for true", function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			state = { condition: 'oui' },
			situationGate = name => state[name]

		expect(evaluateVariable(situationGate, 'condition', rule)).to.be.true
	})

	it('should walk up the namespace chain until it finds the tail as the value', function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			state = {
				'contrat salarié . CDD . motif': 'classique . accroissement activité'
			},
			situationGate = name => state[name]

		expect(
			evaluateVariable(
				situationGate,
				'contrat salarié . CDD . motif . classique . accroissement activité',
				rule
			)
		).to.be.true
	})

	it("should return null if a value isn't found for the name given", function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			state = { condition: 'classique . accroissement activité' },
			situationGate = name => state[name]

		expect(
			evaluateVariable(
				situationGate,
				'contrat salarié . CDD . motif . classique . accroissement activité',
				rule
			)
		).to.be.null
	})

	it('should set the value of variants to false if one of them is true', function() {
		let rule = {
				nom: 'ici',
				espace: 'univers',
				formule: { 'une possibilité': ['noir', 'blanc'] }
			},
			state = { 'univers . ici': 'blanc' },
			situationGate = name => state[name]

		expect(evaluateVariable(situationGate, 'univers . ici . noir', rule)).to.be
			.false
	})
})
