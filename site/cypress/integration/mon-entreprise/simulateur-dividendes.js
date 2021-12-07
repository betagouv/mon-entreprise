const inputSelector = 'div[aria-labelledby="simulator-legend"] input'
const fr = Cypress.env('language') === 'fr'

describe('Simulateur dividendes', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/dividendes'))

	it('should show by default the PFU calculation at 12.8 / 17.2', () => {
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.contains(/[cC]otisations\s+17,2\s*%/)
		cy.contains(/[Ii]mpôt\s+12,8\s*%/)
	})

	it('should allow switching PFU with barème', () => {
		cy.get('div [role="radiogroup"] input').eq(0).should('not.be.checked')
	})
})
