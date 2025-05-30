import { checkA11Y, fr } from '../../support/utils'

describe('Recherche globales', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	it('should display results when an input is written', function () {
		cy.visit('/')

		cy.contains('Rechercher').click()

		cy.contains('Recherche sur le site')

		cy.contains('Fermer').focus()

		// eslint-disable-next-line cypress/unsafe-to-chain-command
		cy.get('input[type=search]').should('be.focused')

		cy.contains('Simulateurs').next().find('li').should('have.length', 6)

		cy.contains('Documentation des simulateurs')
			.next()
			.find('li')
			.should('have.length', 20)

		// eslint-disable-next-line cypress/unsafe-to-chain-command
		cy.focused().type('avocat')

		cy.contains('Simulateurs').next().find('li').should('have.length', 1)

		cy.contains('Documentation des simulateurs')
			.next()
			.find('li')
			.should('have.length.of.at.least', 1)
	})

	it('should check minimal accessibility tests', function () {
		checkA11Y()
	})
})
