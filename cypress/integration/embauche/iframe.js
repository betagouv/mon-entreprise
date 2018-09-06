Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
	return new Cypress.Promise(resolve => {
		setTimeout(() => resolve($iframe.contents().find('body')), 5000)
	})
})

describe('Iframe integration test', function() {
	it('should display an iframe of the simulateur', function() {
		cy.visit('/integration-test')
		cy.get('iframe')
			.iframe()
			.contains('Entrez un salaire mensuel')
	})
})
