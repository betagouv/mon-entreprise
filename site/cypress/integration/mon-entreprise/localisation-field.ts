describe('Champs localisation (simulateur salarié)', function () {
	const fr = Cypress.env('language') === 'fr'
	if (!fr) {
		return
	}

	it('should not crash when selecting localisation', function () {
		cy.intercept({
			method: 'GET',
			hostname: 'geo.api.gouv.fr',
			url: '/communes*',
		}).as('communes')

		cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
		cy.contains('SMIC').click()
		cy.contains('button', 'Commune').click()
		cy.contains('Commune ou code postal').click({ force: true })
		// eslint-disable-next-line cypress/unsafe-to-chain-command
		cy.focused().type('Steenvoorde')
		cy.wait('@communes')
		cy.contains('Steenvoorde (59114)').click({ force: true })
		cy.contains('Suivant').click({ force: true })
		cy.contains('Modifier mes réponses').click({ force: true })
		cy.contains('Steenvoorde')
	})
})
