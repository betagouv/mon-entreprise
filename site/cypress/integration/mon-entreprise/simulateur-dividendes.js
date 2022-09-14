const inputSelector = 'div[id="simulator-legend"] input'
const fr = Cypress.env('language') === 'fr'

describe('Simulateur dividendes', function () {
	if (!fr) {
		return
	}
	before(function () {
		return cy.visit('/simulateurs/dividendes')
	})

	it('should show by default the PFU calculation at 12.8 / 17.2', function () {
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.contains(/[cC]otisations\s+17,2\s*%/)
		cy.contains(/[Ii]mpôt\s+12,8\s*%/)
	})
})
