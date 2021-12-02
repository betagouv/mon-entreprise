describe('Landing test', function () {
	const fr = Cypress.env('language') === 'fr'
	it('should not crash', function () {
		cy.visit('/')
	})
	it('should display logo', function () {
		cy.visit('/')
		cy.get('[data-test-id="logo img"]').should('be.visible')
	})
	it('should display actionnable items', function () {
		cy.visit('/')
		cy.contains(fr ? 'Créer une entreprise' : 'Create a company')
		cy.contains(fr ? 'Gérer mon activité' : 'Manage my business')
	})
})
