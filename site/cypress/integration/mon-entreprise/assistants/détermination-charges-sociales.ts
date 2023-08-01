import { checkA11Y, fr } from '../../../support/utils'

describe(`Assistant charges sociales`, function () {
	if (!fr) {
		return
	}
	before(function () {
		cy.visit(encodeURI('/assistants/declaration-charges-sociales-independant'))
	})

	it('should allow to compute cotisations for IR company', function () {
		cy.contains('Impôt sur le revenu').click()
		cy.contains('Comptabilité de trésorerie').click()
		cy.get(
			'#déclaration_charge_sociales___cotisations_payées___cotisations_sociales'
		).type('12000')
		cy.get(
			'#déclaration_charge_sociales___cotisations_payées___CSG_déductible_et_CFP'
		).type('1000')

		cy.contains('Montants à reporter dans votre déclaration de revenus')

		checkA11Y()
	})
})
