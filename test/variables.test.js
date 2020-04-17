import { expect } from 'chai'
import { getSituationValue } from '../source/engine/getSituationValue'

describe('getSituationValue', function() {
	it('should directly return the value of any rule that specifies a format (i.e currency, duration)', function() {
		let rule = { unité: '€' },
			state = { salaire: '2300' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'salaire', rule)).to.equal('2300')
	})

	it("should interpret rules with 'one of these', with 'oui' for true", function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			state = { condition: 'oui' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'condition', rule)).to.be.true
	})

	it('should walk up the namespace chain until it finds the tail as the value', function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			state = {
				'contrat salarié . CDD . motif': 'classique . accroissement activité'
			},
			situationGate = name => state[name]

		expect(
			getSituationValue(
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
			getSituationValue(
				situationGate,
				'contrat salarié . CDD . motif . classique . accroissement activité',
				rule
			)
		).to.be.null
	})

	it('should set the value of variants to false if one of them is true', function() {
		let rule = {
				nom: 'univers . ici',
				formule: { 'une possibilité': ['noir', 'blanc'] }
			},
			state = { 'univers . ici': 'blanc' },
			situationGate = name => state[name]

		expect(getSituationValue(situationGate, 'univers . ici . noir', rule)).to.be
			.false
	})
})
