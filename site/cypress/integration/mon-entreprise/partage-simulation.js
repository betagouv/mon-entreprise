const fr = Cypress.env('language') === 'fr'

describe('Partage (simulateur salarié)', function () {
	const brutInputSelector = '#salarié___contrat___salaire_brut-input'
	const simulatorUrl = '/simulateurs/salaire-brut-net'
	const searchParams = new URLSearchParams({
		'salaire-brut': '1539€/mois',
		'salarié . contrat': "'CDD'",
		unite: '€/mois',
	})

	const urlWithState = `${simulatorUrl}?${searchParams.toString()}`
	if (!fr) {
		return
	}

	it('devrait remplir les champs à partir de l’URL de partage', function () {
		cy.visit(urlWithState)
		cy.contains('Modifier mes réponses')

		cy.get(brutInputSelector, { timeout: 30 * 1000 })
			.invoke('val')
			.should('match', /1[\s]539[\s]€/)

		cy.contains('Modifier mes réponses').click()
		cy.contains('CDD')
	})

	it('devrait générer une URL de partage à partir de champs remplis', function () {
		cy.visit(simulatorUrl)
		cy.get(brutInputSelector).first().type('{selectall}1539')
		cy.contains('De quel type de contrat').should('be.visible')
		cy.get('label').contains('CDD').should('be.visible').click('left')
		cy.get('button').contains('Suivant').should('be.visible')
		cy.contains('Générer un lien').click()
		cy.get('input[id="simulation-share-url"]')
			.invoke('val')
			.should('eq', Cypress.config().baseUrl + urlWithState)
	})
})
