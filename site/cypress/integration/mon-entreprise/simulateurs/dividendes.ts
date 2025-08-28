import { checkA11Y } from '../../../support/utils'

const inputSelector = 'div[id="simulator-legend"] input'
const fr = Cypress.env('language') === 'fr'

describe('Simulateur dividendes', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	it('should show by default the PFU calculation at 12.8 / 17.2', function () {
		cy.visit('/simulateurs/dividendes')
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.contains(/[cC]otisations\s+17,2\s*%/)
		cy.contains(/[Ii]mpôt\s+12,8\s*%/)
	})

	it('should be RGAA compliant', function () {
		checkA11Y()
	})
})
