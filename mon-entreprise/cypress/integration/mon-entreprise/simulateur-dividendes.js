const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'
const totalSelector = 'section#simulateur-dividendes-section-total'

describe('Simulateur auto-entrepreneur', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/dividendes'))

	it('should show by default the PFU calculation at 12.8 / 17.2', () => {
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.get(totalSelector).contains(/[cC]otisations\s+17,2\s*%/)
		cy.get(totalSelector).contains(/[Ii]mpôt\s+12,8\s*%/)
	})

	it('should allow switching PFU with barème', () => {
		cy.get('input[name="impôt . méthode de calcul"]')
			.eq(1)
			.should('not.be.checked')
	})
})
