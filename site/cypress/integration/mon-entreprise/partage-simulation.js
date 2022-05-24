const fr = Cypress.env('language') === 'fr'

describe('Partage (simulateur salarié)', function () {
	const brutInputSelector =
		'#contrat\\ salarié\\ \\.\\ rémunération\\ \\.\\ brut\\ de\\ base'
	const simulatorUrl = '/simulateurs/salaire-brut-net'
	const searchParams = new URLSearchParams({
		'salarié': "'CDD'",
		'salaire-brut': '1539€/mois',
	})
	searchParams.set('utm_source', 'sharing')

	const urlWithState = `${simulatorUrl}?${searchParams.toString()}`
	if (!fr) {
		return
	}
	it('should set input value from URL', function () {
		cy.visit(urlWithState)
		cy.get(brutInputSelector)
			.first()
			.invoke('val')
			.should('match', /1[\s]539[\s]€/)

		cy.contains('Modifier mes réponses').click()
		cy.contains('CDD')
	})
	it('should set URL from input value', function () {
		cy.visit(simulatorUrl)
		cy.get(brutInputSelector).first().type('{selectall}1539')
		cy.contains('De quel type de contrat').should('be.visible')
		cy.get('label').contains('CDD').should('be.visible').click()
		cy.get('button').contains('Suivant').should('be.visible')
		cy.contains('Générer un lien').click()
		cy.get('input[aria-label="URL de votre simulation"]')
			.invoke('val')
			.should('eq', Cypress.config().baseUrl + urlWithState)
	})
})
