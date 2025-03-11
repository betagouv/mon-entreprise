describe('France Travail', function () {
	it('devrait afficher une iframe du simulateur', function () {
		cy.on('uncaught:exception', (err) => {
			return !err.message.includes("Unexpected token '<'")
		})
		cy.visit('https://entreprise.francetravail.fr/cout-salarie/')
		cy.get('#simulateurEmbauche').iframe().contains('Salaire net')
	})
})

describe('Urssaf', function () {
	it('devrait afficher une iframe du simulateur', function () {
		cy.visit(
			'https://www.urssaf.fr/accueil/outils-documentation/simulateurs/cotisations-employeur.html'
		)
		cy.get('#simulateurEmbauche').iframe().contains('Salaire net')
	})
})
