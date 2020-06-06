const fr = Cypress.env('language') === 'fr'
const testText = (selector, text) =>
	cy.get(`[data-test-id=${selector}]`).should($span => {
		const displayedText = $span
			.text()
			.trim()
			.replace(/[\s]/g, ' ')
		console.log(displayedText, text)
		expect(displayedText).to.eq(text)
	})

describe('Page covid-19', function() {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/chômage-partiel'))
	it('should not crash', () => {
		cy.contains('Salaire brut mensuel')
	})
	it('should display 100% de prise en charge pour un SMIC', () => {
		cy.get('input.currencyInput__input').click()
		cy.contains('SMIC').click()
		testText('comparaison-net', 'Soit 100 % du revenu net')
		testText('comparaison-total', 'Soit 0 % du coût habituel')
	})
	it('should display 85 % de prise en charge pour un salaire médian', () => {
		cy.contains('salaire médian').click()
		testText('comparaison-net', 'Soit 85 % du revenu net')
		testText('comparaison-total', 'Soit 8 % du coût habituel')
	})
})
