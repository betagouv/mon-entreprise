const fr = Cypress.env('language') === 'fr'

// TODO Échoue parfois … à creuser
describe.skip("Détection de l'entreprise depuis le cookie urssaf.fr", function () {
	if (!fr) {
		return
	}
	before(function () {
		cy.setCookie(
			'EnLigne',
			'siret=34473897600010&nom=Magnin&prenom=Clarisse&sl_retour_service='
		)
		return cy.visit('/')
	})

	it('should display the name of the company set in the cookie', function () {
		cy.contains('MC KINSEY', { timeout: 10000 })
	})
})
