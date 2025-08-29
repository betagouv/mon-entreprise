import { checkA11Y, fr } from '../../../support/utils'

describe('Simulateur de location de meublé', () => {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	beforeEach(() => {
		return cy.visit('/simulateurs/location-de-logement-meuble')
	})

	it('s’affiche', () => {
		cy.get('h1')
			.should('be.visible')
			.and('contain', 'Simulateur de revenu pour location de logement meublé')
	})

	it('affiche le formulaire', () => {
		cy.get(inputSelector).should('be.visible')
	})

	it('chiffre les cotisations quand on saisit des revenus', () => {
		cy.get(inputSelector).type('{selectall}25000')

		cy.contains('Estimation des cotisations')
			.should('be.visible')
			.and('have.lengthOf.at.least', 1)
	})

	it.skip('ne chiffre rien si on dépasse le plafond de recettes au régime général', () => {
		cy.get(inputSelector).type('{selectall}78000')

		cy.contains('Estimation des cotisations').should('not.exist')

		cy.get('main').should(
			'contain',
			'Vous devez vous orienter vers les statuts'
		)
	})

	it('est accessible', function () {
		checkA11Y()
	})
})
