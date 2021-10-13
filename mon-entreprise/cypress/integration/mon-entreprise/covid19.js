const fr = Cypress.env('language') === 'fr'
const testText = (selector, callback) =>
	cy.get(`[data-test-id=${selector}]`).should(($span) => {
		const displayedText = $span.text().trim().replace(/[\s]/g, ' ')
		callback(displayedText)
	})

describe('Page covid-19', function () {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/chômage-partiel')))
	it('should not crash', () => {
		cy.contains('Salaire brut mensuel')
	})
	it('should display 100% de prise en charge pour un SMIC', () => {
		cy.get('input.currencyInput__input').click()
		cy.contains('SMIC').click()
		testText('comparaison-net', (text) =>
			expect(text).to.eq('Soit 100 % du revenu net')
		)
		testText('comparaison-total', (text) =>
			expect(text).to.eq('Soit 0 % du coût habituel')
		)
	})
	it('should display an amount for the prise en charge pour un salaire médian', () => {
		cy.contains('salaire médian').click()
		testText('comparaison-net', (text) =>
			expect(text).to.match(/Soit [\d]{2} % du revenu net/)
		)
		testText('comparaison-total', (text) =>
			expect(text).to.match(/Soit [\d]{1} % du coût habituel/)
		)
	})
})
