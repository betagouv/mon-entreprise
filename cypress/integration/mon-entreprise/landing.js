cy.default
describe('Landing test', function() {
	it('should not crash', function() {
		cy.visit('/')
		cy.contains('mon-entreprise.fr')
	})
	it('should display urssaf and marianne logo', function() {
		cy.visit('/')
		cy.get('img[alt="logo urssaf"]').should('be.visible')
		cy.get('img[alt="logo marianne"]').should('be.visible')
	})
	it('should display actionnable items', function() {
		cy.visit('/')
		cy.contains('Créer une entreprise').should('be.')
		cy.contains('Estimer les cotisations et taxes')
	})
})
