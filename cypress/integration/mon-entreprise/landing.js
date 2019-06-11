describe('Landing test', function() {
	const fr = Cypress.env('language') === 'fr'
	it('should not crash', function() {
		cy.visit('/')
		cy.get('img[alt="logo mon-entreprise.fr"]').should('be.visible')
	})
	it('should display urssaf and marianne logo', function() {
		cy.visit('/')
		cy.get('img[alt="logo urssaf"]').should('be.visible')
		cy.get('img[alt="logo marianne"]').should('be.visible')
	})
	it('should display actionnable items', function() {
		cy.visit('/')
		cy.contains(fr ? 'Créer mon entreprise' : 'Create my company in France')
		cy.contains(
			fr
				? 'Simuler les cotisations et les taxes'
				: 'Simulate contributions and taxes'
		)
	})
})
