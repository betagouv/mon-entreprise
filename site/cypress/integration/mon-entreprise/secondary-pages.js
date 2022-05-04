const fr = Cypress.env('language') === 'fr'

describe('Secondary pages', function () {
	if (!fr) {
		return
	}

	it("page stats doesn't crash", function () {
		cy.visit('/stats')
		cy.contains('Statistiques détaillées')
	})

	it.skip('navigate in the news section', function () {
		cy.visit('/nouveautés')
		cy.contains('←').click()
		cy.url().should('match', /\/nouveautés\/[^/]*$/)
	})
})
