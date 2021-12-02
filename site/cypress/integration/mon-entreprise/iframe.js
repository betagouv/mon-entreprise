describe('Iframe integration test', function () {
	if (Cypress.env('language') !== 'fr') {
		return
	}
	it('should display an iframe of the simulateur', function () {
		cy.visit('/dev/integration-test')
		cy.contains('Visualiser').click()
		cy.get('#simulateurEmbauche').iframe().contains('Salaire net')
	})
})
