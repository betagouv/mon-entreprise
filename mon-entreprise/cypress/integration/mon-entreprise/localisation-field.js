const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'

describe('Champs localisation (simulateur salarié)', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))

	it('should not crash when selecting localisation', function () {
		cy.get(inputSelector).first().type('{selectall}42')
		cy.contains('Commune').click({ force: true })
		cy.get('fieldset input[type="search"]').type('Steenvoorde')
		cy.contains('Steenvoorde (59114)').click({ force: true })
		cy.contains('Suivant').click({ force: true })
		cy.contains('Voir mes paramètres').click({ force: true })
		cy.contains('Steenvoorde')
	})
})
