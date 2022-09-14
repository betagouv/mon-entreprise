import { fr } from '../../support/utils'

const inputSelector = 'div[id="simulator-legend"] input'

describe('Iframe pamc', function () {
	if (!fr) {
		return
	}
	before(function () {
		return cy.visit('/iframes/pamc')
	})

	it('should allow to navigate to the dentiste simulateur from iframe pamc home page', function () {
		cy.contains('Chirurgien-dentiste').click()
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('CARCDSF')
	})
})
