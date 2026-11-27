import { checkA11Y } from '../../support/utils'

describe('Landing page', function () {
	it('should not crash', function () {
		cy.visit('/')
	})

	it('should display logo', function () {
		cy.visit('/')
		cy.get('[data-test-id="logo img"]').should('be.visible')
	})

	it('should be RGAA compliant', function () {
		cy.visit('/')
		checkA11Y()
	})
})
