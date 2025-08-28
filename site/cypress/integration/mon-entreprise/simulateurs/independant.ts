import { fr } from '../../../support/utils'

describe('Simulateur indépendant', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	before(function () {
		return cy.visit('/simulateurs/indépendant')
	})

	it('should not display info about cotisations forfaitaires début activité by default', function () {
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains(
			'Comment fonctionne la régularisation des cotisations provisionnelles'
		)
		cy.contains('Montant des cotisations forfaitaires').should('not.exist')
	})
})
