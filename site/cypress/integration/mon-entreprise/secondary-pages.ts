import { fr } from '../../support/utils'

describe('Secondary pages', function () {
	if (!fr) {
		return
	}

	it("page stats doesn't crash", function () {
		cy.visit('/stats')
		cy.contains('Statistiques détaillées')
	})

	it('navigate in the news section', function () {
		cy.visit('/nouveautés')
		cy.contains('←').click()
		cy.url({ decode: true }).should('match', /\/nouveautés\/[^/]*$/)
	})
})
