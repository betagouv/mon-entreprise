describe('Landing basic test', function() {
	it('should not crash when requesting the page', function() {
		cy.visit('/')
	})
	it('should display the simulateur after loading', function() {
		cy.visit('/')
		cy.contains('Entrez un salaire mensuel')
	})
})
