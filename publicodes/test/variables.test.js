import { expect } from 'chai'
import { getSituationValue } from '../source/getSituationValue'

describe('getSituationValue', function() {
	it('should directly return the value of any rule that specifies a format (i.e currency, duration)', function() {
		let rule = { unité: '€' },
			situation = { salaire: '2300' }

		expect(getSituationValue(situation, 'salaire', rule)).to.equal('2300')
	})

	it("should interpret rules with 'one of these', with 'oui' for true", function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			situation = { condition: 'oui' }

		expect(getSituationValue(situation, 'condition', rule)).to.be.true
	})

	it('should walk up the namespace chain until it finds the tail as the value', function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			situation = {
				'contrat salarié . CDD . motif': 'classique . accroissement activité'
			}

		expect(
			getSituationValue(
				situation,
				'contrat salarié . CDD . motif . classique . accroissement activité',
				rule
			)
		).to.be.true
	})

	it("should return null if a value isn't found for the name given", function() {
		let rule = { formule: { 'une possibilité': ['noir', 'blanc'] } },
			situation = { condition: 'classique . accroissement activité' }

		expect(
			getSituationValue(
				situation,
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
			situation = { 'univers . ici': 'blanc' }

		expect(getSituationValue(situation, 'univers . ici . noir', rule)).to.be
			.false
	})
})
