/* @flow */

import { expect } from 'chai';
import FicheDePaieSelectors, { COTISATION_BRANCHE_ORDER } from 'Selectors/ficheDePaieSelectors';
// $FlowFixMe
import salariéConfig from 'Components/simulationConfigs/salarié.yaml';

let state = {
	form: {
		conversation: {
			values: {
				'contrat salarié': { salaire: { 'brut de base': '2300' } },
				entreprise: { effectif: '50' }
			}
		}
	},
	simulation: {
		config: salariéConfig,
	},
	conversationStarted: true,
	conversationSteps: {
		foldedSteps: []
	}
}

let paySlip = null

describe('pay slip selector', function() {
	beforeEach(() => {
		// $FlowFixMe
		paySlip = FicheDePaieSelectors(state)

		expect(paySlip).not.to.eq(null)
	})
	it('should have cotisations grouped by branches in the proper ordering', function() {
		// $FlowFixMe
		let branches = paySlip.cotisations.map(([branche]) => branche)
		expect(branches.map(({ id }) => id)).to.eql(COTISATION_BRANCHE_ORDER)
	})

	it('should collect all cotisations in a branche', function() {
		// $FlowFixMe
		let cotisationsSanté = (paySlip.cotisations.find(
			([branche]) => branche.nom === 'santé'
		) || [])[1].map(cotisation => cotisation.nom)
		expect(cotisationsSanté).to.have.lengthOf(3)
		expect(cotisationsSanté).to.include('maladie')
		expect(cotisationsSanté).to.include('complémentaire santé')
		expect(cotisationsSanté).to.include('médecine du travail')
	})

	it('should sum all cotisations', function() {
		// $FlowFixMe
		const montantTotalCotisations = paySlip.totalCotisations
		expect(montantTotalCotisations.partPatronale).to.be.closeTo(840.4, 5)
		expect(montantTotalCotisations.partSalariale).to.be.closeTo(498, 5)
	})

	it('should have value for "salarié" and "employeur" for a cotisation', function() {
		// $FlowFixMe
		let cotisationATMP = (paySlip.cotisations.find(
			([branche]) =>
				branche.nom === 'accidents du travail et maladies professionnelles'
		) || [])[1][0]
		expect(cotisationATMP.montant.partSalariale).to.be.closeTo(0, 0.1)
		let defaultATMPRate = 2.22 / 100
		expect(cotisationATMP.montant.partPatronale).to.be.closeTo(
			2300 * defaultATMPRate,
			1
		)
	})
})
