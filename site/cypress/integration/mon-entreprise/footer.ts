import { fr } from '../../support/utils'

describe('Footer', function () {
	if (!fr) {
		return
	}

	it('should contain a legal notice link', function () {
		cy.visit('/')
		cy.contains('footer button', 'Mentions légales').should('be.visible')
	})

	it('should display the legal notice on click', function () {
		cy.visit('/')
		cy.contains('footer button', 'Mentions légales').click()
		cy.get('div[data-cy="modal"]')
			.should('be.visible')
			.and('include.text', 'Mentions légales')
	})

	it('should contain a terms of use link', function () {
		cy.visit('/')
		cy.contains('footer button', "Conditions générales d'utilisation").should(
			'be.visible'
		)
	})

	it('should display the terms of use on click', function () {
		cy.visit('/')
		cy.contains('footer button', "Conditions générales d'utilisation").click()
		cy.get('div[data-cy="modal"]')
			.should('be.visible')
			.and('include.text', "Conditions générales d'utilisation")
	})

	it('should contain a privacy policy link', function () {
		cy.visit('/')
		cy.contains('footer button', 'Politique de confidentialité').should(
			'be.visible'
		)
	})

	it('should display the privacy policy on click', function () {
		cy.visit('/')
		cy.contains('footer button', 'Politique de confidentialité').click()
		cy.get('div[data-cy="modal"]')
			.should('be.visible')
			.and('include.text', 'Politique de confidentialité')
	})
})
