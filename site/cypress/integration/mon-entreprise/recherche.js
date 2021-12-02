const fr = Cypress.env('language') === 'fr'

const simulateursPath = '.ais-Hits-list'
const reglesPath = '.ais-InfiniteHits-list'

describe('Recherche globales', () => {
	if (!fr || Cypress.config().baseUrl != 'https://mon-entreprise.urssaf.fr') {
		return
	}

	it('should display the search results when the magnifying glass is clicked', () => {
		cy.visit('/')

		cy.get('#search-display-button').click()

		cy.wait(30)
		cy.focused().should('have.attr', 'type', 'search')

		cy.wait(100)
		cy.get(simulateursPath).children().should('have.length', 6)
		cy.get(reglesPath).children().should('have.length', 20)

		cy.focused().type('avocat')

		cy.wait(100)
		cy.get(simulateursPath).children().should('have.length', 1)
		cy.get(reglesPath).children().should('have.length', 2)
	})
})
