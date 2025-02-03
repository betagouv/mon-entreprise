import { checkA11Y, fr } from '../../support/utils'

describe('Simulateur de location de meublé', () => {
	if (!fr) {
		return
	}

	beforeEach(() => {
		return cy.visit('/simulateurs/location-de-logement-meuble')
	})

	it('s’affiche', () => {
		cy.get('h1').should(
			'contain',
			'Simulateur de revenu pour location de logement meublé'
		)
	})

	it('affiche le formulaire', () => {
		cy.get('input#location_de_logement___meublé___loyer___net').should(
			'be.visible'
		)
	})

	it('est accessible', function () {
		checkA11Y()
	})
})
