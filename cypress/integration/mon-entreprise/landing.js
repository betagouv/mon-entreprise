describe('Landing test', function() {
	const fr = Cypress.env('language') === 'fr'
	it('should not crash', function() {
		cy.visit('/')
		cy.contains(fr ? 'Mon-entreprise.fr' : 'My company in France')
	})
	it('should display urssaf and marianne logo', function() {
		cy.visit('/')
		cy.get('img[alt="logo urssaf"]').should('be.visible')
		cy.get('img[alt="logo marianne"]').should('be.visible')
	})
	it('should display actionnable items', function() {
		cy.visit('/')
		cy.contains(fr ? 'Créer une entreprise' : 'Create a company in France')
		cy.contains(
			fr
				? 'Estimer les cotisations et les taxes'
				: 'Estimate contributions and taxes'
		)
	})
})
