const fr = Cypress.env('language') === 'fr'

describe('Partage (simulateur salarié)', function () {
	const brutInputSelector = '#salarié___contrat___salaire_brut-input'
	const simulatorUrl = '/simulateurs/salaire-brut-net'
	const searchParams = new URLSearchParams({
		'salarié . contrat': "'CDD'",
		'salarié . contrat . salaire brut': '2700 €/mois',
		unité: '€/mois',
	})

	const urlWithSearchParams = `${simulatorUrl}?${searchParams.toString()}`
	if (!fr) {
		return
	}

	it('devrait remplir les champs à partir de l’URL de partage', function () {
		cy.visit(urlWithSearchParams)

		cy.contains('Modifier mes réponses').should('be.visible')

		cy.get(brutInputSelector)
			.invoke('val')
			.should(($value) => {
				expect($value).to.be.equal('2 700 €')
			})

		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.should('include.text', 'CDD')
			.and('include.text', '2 700 €/mois')
	})

	it('devrait générer une URL de partage à partir de champs remplis', function () {
		cy.visit(simulatorUrl)

		cy.get(brutInputSelector).first().type('{selectall}2700')
		cy.contains('De quel type de contrat').should('be.visible')
		cy.get('label').contains('CDD').should('be.visible').click('left')
		cy.get('button').contains('Suivant').should('be.visible')

		cy.contains('Générer un lien').click()
		cy.get('input[id="simulation-share-url"]')
			.invoke('val')
			.should('eq', Cypress.config().baseUrl + urlWithSearchParams)
	})
})
