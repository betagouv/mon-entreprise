const fr = Cypress.env('language') === 'fr'

describe('General navigation', function () {
	it('should enable switching site language', function () {
		cy.visit(
			fr
				? encodeURI('/assistants/choix-du-statut')
				: '/assistants/choice-of-status'
		)
		cy.contains(
			fr ? 'Switch to the English version' : 'Passer à la version française'
		).click()
		cy.url().should(
			'include',
			fr
				? '/assistants/choice-of-status'
				: encodeURI('/assistants/choix-du-statut')
		)
	})

	it('should go back to home when clicking on logo', function () {
		cy.visit(encodeURI('/documentation/contrat-salarié'))
		cy.get('[data-test-id="logo img"]').click()
		cy.url().should('match', new RegExp(`${Cypress.config().baseUrl}/?`))
	})
})
