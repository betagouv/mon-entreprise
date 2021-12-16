const fr = Cypress.env('language') === 'fr'

describe('Recherche globales', () => {
	if (!fr || Cypress.config().baseUrl != 'https://mon-entreprise.urssaf.fr') {
		return
	}

	it('should display the search results when the magnifying glass is clicked', () => {
		cy.visit('/')

		cy.contains('Rechercher').click()

		cy.wait(30)
		cy.focused().should('have.attr', 'type', 'search')

		cy.wait(100)
		cy.contains('Simulateurs')
			.next()
			.find('[role="button"]')
			.should('have.length', 6)
		cy.contains('Règles de calculs').next().find('li').should('have.length', 20)

		cy.focused().type('avocat')

		cy.wait(100)
		cy.contains('Simulateurs')
			.next()
			.find('[role="button"]')
			.should('have.length', 1)
		cy.contains('Règles de calculs').next().find('li').should('have.length', 2)
	})
})
