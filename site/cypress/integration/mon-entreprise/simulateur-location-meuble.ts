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
		cy.get(
			'input#location_de_logement_meublé___courte_durée___recettes'
		).should('be.visible')
	})

	it('chiffre les cotisations quand on saisi des revenus', () => {
		cy.get('input#location_de_logement_meublé___courte_durée___recettes').type(
			'1000'
		)

		cy.get('input#location_de_logement_meublé___cotisations')
			.should('be.visible')
			.should('have.lengthOf.at.least', 1)
	})

	it('est accessible', function () {
		checkA11Y()
	})
})
