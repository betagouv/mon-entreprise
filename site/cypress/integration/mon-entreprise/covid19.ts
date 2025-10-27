import { checkA11Y, fr } from '../../support/utils'

describe('Page covid-19', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	before(function () {
		return cy.visit(encodeURI('/simulateurs/activité-partielle'))
	})
	it('should not crash', function () {
		cy.contains('Salaire brut mensuel')
	})

	it('should be RGAA compliant', function () {
		checkA11Y()
	})

	it('should display 100% de prise en charge pour un SMIC', function () {
		cy.contains('SMIC').click()

		cy.get('[data-test-id=comparaison-net]').contains(
			/Soit 100 % du revenu net/
		)

		cy.get('[data-test-id=comparaison-total]').contains(
			/Soit [\d]{2} % du coût habituel/
		)
	})

	it('should display an amount for the prise en charge pour un salaire médian', function () {
		cy.contains('salaire médian').click()

		cy.get('[data-test-id=comparaison-net]').contains(
			/Soit [\d]{2} % du revenu net/
		)

		cy.get('[data-test-id=comparaison-total]').contains(
			/Soit [\d]{2} % du coût habituel/
		)
	})
})
