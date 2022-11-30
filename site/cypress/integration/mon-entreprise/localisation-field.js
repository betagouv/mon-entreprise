const fr = Cypress.env('language') === 'fr'

describe('Champs localisation (simulateur salarié)', function () {
	if (!fr) {
		return
	}
	before(function () {
		return cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
	})

	it('should not crash when selecting localisation', function () {
		cy.contains('SMIC').click()
		cy.contains('button', 'Commune').click()
		cy.contains('Commune ou code postal')
			.click({ force: true })
			.focused()
			.type('Steenvoorde')
		cy.contains('Steenvoorde (59114)').click({ force: true })
		cy.contains('Suivant').click({ force: true })
		cy.contains('Modifier mes réponses').click({ force: true })
		cy.contains('Steenvoorde')
	})
})
