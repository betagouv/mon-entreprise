const searchInputPath = '#company-search-input'
const searchResultsPath = '#company-search-results'
const currentCompanyPath = '#currently-selected-company'

describe('Landing page', function () {
	it('should not crash', function () {
		cy.visit('/')
	})

	it('should display logo', function () {
		cy.visit('/')
		cy.get('[data-test-id="logo img"]').should('be.visible')
	})

	it('should provide the company search flow', function () {
		cy.visit('/')

		cy.get(currentCompanyPath).should('not.exist')

		cy.get(searchInputPath).should('have.attr', 'placeholder')
		cy.get(searchInputPath).invoke('attr', 'type').should('equal', 'search')
		cy.get(searchInputPath).focus().type('noima')

		cy.wait(100)

		cy.get(searchResultsPath).children().should('have.length', 6)
		cy.get(searchResultsPath).children().first().click()

		cy.url().should('include', '/mon-entreprise/g%C3%A9rer')

		cy.go('back')

		cy.get(currentCompanyPath).should('exist')
		cy.get(currentCompanyPath).click()

		cy.url().should('include', '/mon-entreprise/g%C3%A9rer')
	})
})
