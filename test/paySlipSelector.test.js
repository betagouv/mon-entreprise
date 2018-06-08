/* @flow */

import { expect } from 'chai'
import paySlipSelector, {
	COTISATION_BRANCHE_ORDER
} from '../source/components/ResultView/PaySlip/selectors'
import { enrichRule, rulesFr as realRules } from '../source/engine/rules'
import reduceSteps from '../source/reducers/reduceSteps'

describe('pay slip selector', function() {
	let paySlip
	beforeEach(() => {
		let fakeState = {}
		let stateSelector = () => name => fakeState[name]
		let rules = realRules.map(enrichRule)
		let reducer = reduceSteps(rules, stateSelector)

		var step1 = reducer(
			{
				foldedSteps: [],
				targetNames: [
					'contrat salarié . salaire . net à payer',
					'contrat salarié . salaire . total',
					'contrat salarié . salaire . net imposable'
				]
			},
			{ type: 'START_CONVERSATION' }
		)
		fakeState['contrat salarié . salaire . brut de base'] = 2300
		var step2 = reducer(step1, {
			type: 'STEP_ACTION',
			name: 'fold',
			step: 'contrat salarié . salaire .brut de base'
		})
		paySlip = paySlipSelector(step2)
	})

	it('should have cotisations grouped by branches in the proper ordering', function() {
		let branches = paySlip.cotisations.map(([branche]) => branche)
		expect(branches).to.eql(COTISATION_BRANCHE_ORDER)
	})

	it('should collect all cotisations in a branche', function() {
		let cotisationsSanté = (paySlip.cotisations.find(
			([branche]) => branche === 'santé'
		) || [])[1].map(cotisation => cotisation.nom)
		console.log(cotisationsSanté)
		expect(cotisationsSanté).to.have.lengthOf(3)
		expect(cotisationsSanté).to.include('maladie')
		expect(cotisationsSanté).to.include('complémentaire santé')
		expect(cotisationsSanté).to.include('médecine du travail')
	})

	it('should sum all cotisations', function() {
		const montantTotalCotisations = paySlip.totalCotisations
		expect(montantTotalCotisations.partPatronale).to.be.closeTo(919, 5)
		expect(montantTotalCotisations.partSalariale).to.be.closeTo(520, 5)
	})

	it('should have value for "salarié" and "employeur" for a cotisation', function() {
		let cotisationATMP = (paySlip.cotisations.find(
			([branche]) =>
				branche === 'accidents du travail / maladies professionnelles'
		) || [])[1][0]
		expect(cotisationATMP.montant.partSalariale).to.be.closeTo(0, 0.1)
		let defaultATMPRate = 2.22 / 100
		expect(cotisationATMP.montant.partPatronale).to.be.closeTo(
			2300 * defaultATMPRate,
			1
		)
	})
})
