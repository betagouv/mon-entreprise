const fr = Cypress.env('language') === 'fr'

describe('Simulateur salarié mode partagé', () => {
	const brutInputSelector =
		'input.currencyInput__input[name="contrat salarié . rémunération . brut de base"]'
	const simulatorUrl = '/simulateurs/salaire-brut-net'
	const searchParams = new URLSearchParams({
		'contrat salarié': "'CDD'",
		'salaire-brut': '1539€/mois',
	})
	searchParams.set('utm_source', 'sharing')

	const urlWithState = `${simulatorUrl}?${searchParams.toString()}`
	if (!fr) {
		return
	}
	it('should set input value from URL', function () {
		cy.visit(urlWithState)
		cy.wait(800)
		cy.get(brutInputSelector).first().invoke('val').should('eq', '1 539')

		cy.contains('Voir mes paramètres').click()
		cy.get('span.answerContent').first().contains('CDD')
	})
	it('should set URL from input value', function () {
		cy.visit(simulatorUrl)
		cy.get(brutInputSelector).first().type('{selectall}1539')
		cy.wait(1000)
		cy.get('.step').find('input[value="\'CDD\'"]').click({ force: true })
		cy.wait(1000)
		cy.contains('Générer un lien').click()
		cy.get('.shareableLink')
			.invoke('val')
			.should('eq', Cypress.config().baseUrl + urlWithState)
	})
})
