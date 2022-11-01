import { fr } from '../../support/utils'

describe('Recherche globales', function () {
	if (!fr) {
		return
	}

	it('should display the search results when the magnifying glass is clicked', function () {
		cy.visit('/')

		cy.contains('Rechercher').click()

		cy.focused().should('have.attr', 'type', 'search')

		cy.contains('Simulateurs')
			.next()
			.find('[role="button"]')
			.should('have.length', 6)
		cy.contains('Règles de calculs').next().find('li').should('have.length', 20)

		cy.focused().type('avocat')

		cy.contains('Simulateurs')
			.next()
			.find('[role="button"]')
			.should('have.length', 1)
		cy.contains('Règles de calculs')
			.next()
			.find('li')
			.should('have.length.of.at.least', 1)
	})
})
