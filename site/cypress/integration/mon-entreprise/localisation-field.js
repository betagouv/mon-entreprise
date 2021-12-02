const fr = Cypress.env('language') === 'fr'

describe('Champs localisation (simulateur salarié)', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))

	it('should not crash when selecting localisation', function () {
		cy.contains('SMIC').click()
		cy.contains('Commune').click({ force: true })
		cy.contains('Commune ou code postal')
			.click({ force: true })
			.focused()
			.type('Steenvoorde')
		cy.contains('Steenvoorde (59114)').click({ force: true })
		cy.contains('Suivant').click({ force: true })
		cy.contains('Voir mes paramètres').click({ force: true })
		cy.contains('Steenvoorde')
	})
})
