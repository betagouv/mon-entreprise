describe('Pole emploi', function() {
	it('should display an iframe of the simulateur', function() {
		cy.on('uncaught:exception', err => {
			return !err.message.contains('Unexpected token <')
		})
		cy.visit('https://entreprise.pole-emploi.fr/cout-salarie/')
		cy.get('#simulateurEmbauche')
			.iframe()
			.contains('Salaire net')
	})
})

describe('URSSAF', function() {
	it('should display an iframe of the simulateur', function() {
		cy.visit(
			'https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html'
		)
		cy.get('#simulateurEmbauche')
			.iframe()
			.contains('Salaire net')
	})
})
