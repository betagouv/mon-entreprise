describe('Iframe integration test', function() {
	it('should display an iframe of the simulateur', function() {
		cy.visit('/dev/integration-test')
		cy.get('#simulateurEmbauche')
			.iframe()
			.contains('Salaire net')
	})
})
