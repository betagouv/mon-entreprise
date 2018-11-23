describe('Iframe integration test', function() {
	it('should display an iframe of the simulateur', function() {
		cy.visit('/integration-test')
		cy.get('#simulateurEmbauche')
			.iframe()
			.contains('Touché par le salarié')
	})
})
