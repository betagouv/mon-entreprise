const fr = Cypress.env('language') === 'fr'

describe('Page covid-19', function() {
	if (!fr) {
		return
	}
	before(() => cy.visit(`/coronavirus`))
	it('should not crash', () => {
		cy.contains('Salaire brut mensuel')
	})
	it('should display 100% de prise en charge pour un SMIC', () => {
		cy.get('input.currencyInput__input').click()
		cy.contains('SMIC').click()
		cy.contains('Soit 100% du revenu net')
		cy.contains('Soit 0% du coût habituel')
	})
	it('should display 85% de prise en charge pour un salaire médian', () => {
		cy.contains('salaire médian').click()
		cy.contains('Soit 85% du revenu net')
		cy.contains('Soit 0% du coût habituel')
	})
})
