import { checkA11Y, fr } from '../../support/utils'

describe('Réduction générale', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	before(function () {
		return cy.visit('/simulateurs/réduction-générale')
	})

	it('should not crash', function () {
		cy.contains('Salaire brut')
	})

	it('should allow to select a company size', function () {
		cy.get(inputSelector).first().type('{selectall}2000')

		cy.contains('Plus de 50 salariés').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.eq(0)
			.contains('Effectif')
			.next()
			.contains('100')
		cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()

		cy.contains('Moins de 50 salariés').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.eq(0)
			.contains('Effectif')
			.next()
			.contains('10')
		cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()
	})

	it('should allow to change time period', function () {
		cy.contains('Réduction mensuelle').click()
		cy.get(inputSelector).first().type('{selectall}2000')

		cy.contains('Réduction annuelle').click()
		cy.get(inputSelector).first().should('have.value', '24 000 €')
	})

	it('should display values for the réduction générale', function () {
		cy.contains('Réduction mensuelle').click()
		cy.get(inputSelector).first().type('{selectall}1900')

		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale-value"]'
		).should('include.text', '493,43 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_retraite-value"]'
		).should('include.text', '92,85 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_Urssaf-value"]'
		).should('include.text', '400,58 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_Urssaf___part_chômage-value"]'
		).should('include.text', '62,57 €')
	})

	it('should display a warning for a salary too high', function () {
		cy.contains('Réduction mensuelle').click()
		cy.get(inputSelector).first().type('{selectall}3000')

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.'
		)

		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_retraite-value"]'
		).should('include.text', '0 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_Urssaf-value"]'
		).should('include.text', '0 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___réduction_générale___part_Urssaf___part_chômage-value"]'
		).should('include.text', '0 €')
	})

	it('should be RGAA compliant', function () {
		checkA11Y()
	})
})
