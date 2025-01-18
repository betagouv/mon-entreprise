describe('Pole emploi', function () {
	it('should display an iframe of the simulateur', function () {
		cy.on('uncaught:exception', (err) => {
			return !err.message.includes("Unexpected token '<'")
		})
		cy.visit('https://entreprise.pole-emploi.fr/cout-salarie/')
		cy.get('#simulateurEmbauche').iframe().contains('Salaire net')
	})
})

describe('Urssaf', function () {
	it('should display an iframe of the simulateur', function () {
		cy.visit(
			'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/cotisations-employeur.html'
		)
		cy.get('#simulateurEmbauche').iframe().contains('Salaire net')
	})
})
