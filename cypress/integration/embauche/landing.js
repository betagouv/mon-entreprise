describe('Landing basic test', function() {
	it('should not crash when requesting the page', function() {
		cy.visit('http://localhost:8080/embauche')
	})
	it('should display the simulateur after loading', function() {
		cy.visit('http://localhost:8080/embauche')
		cy.contains('Entrez un salaire mensuel')
	})
})
