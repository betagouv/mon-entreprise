const inputSelector = 'input.currencyInput__input:not([name$="charges"])'
const chargeInputSelector = 'input.currencyInput__input[name$="charges"]'
const fr = Cypress.env('language') === 'fr'

export const runSimulateurTest = (simulateur) => {
	if (!fr) return

	describe(`Simulateur ${simulateur}`, () => {
		before(() => cy.visit(encodeURI(`/simulateurs/${simulateur}`)))
		it('should not crash', function () {
			cy.get(inputSelector)
		})

		it('should display a result when entering a value in any of the currency input', () => {
			cy.contains('Annuel').click()
			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).type(1000)
			}
			cy.get(inputSelector).each(($testedInput) => {
				cy.wrap($testedInput)
					.type('{selectall}60111')
					.and(($i) =>
						expect($i.val().replace(/[\s,.]/g, '')).to.match(/[1-9][\d]{3,6}$/)
					)
				cy.get(inputSelector).each(($input) => {
					if ($testedInput.get(0) === $input.get(0)) return
					cy.wrap($input).and(($i) => {
						const val = $i.val().replace(/[\s,.]/g, '')
						expect(val).not.to.be.eq('60111')
						expect(val).to.match(/[1-9][\d]{3,6}$/)
					})
				})
				cy.contains('Cotisations')
			})
		})

		it('should allow to change period', function () {
			cy.contains('Annuel').click()
			cy.get(inputSelector).first().type('{selectall}12000')
			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).type('{selectall}6000')
			}
			cy.get(inputSelector).eq(1).invoke('val').should('not.be.empty')
			cy.contains('Mensuel').click()
			cy.get(inputSelector)
				.first()
				.invoke('val')
				.should('match', /1[\s]000/)
			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).first().invoke('val').should('eq', '500')
			}
			cy.contains('Annuel').click()
		})

		it('should allow to navigate to a documentation page', function () {
			cy.get(inputSelector).first().type('{selectall}2000')
			cy.contains('Cotisations').click()
			cy.location().should((loc) => {
				expect(loc.pathname).to.match(/\/documentation\/.*\/cotisations/)
			})
		})

		it('should allow to go back to the simulation', function () {
			cy.contains('← ').click()
			cy.get(inputSelector).first().invoke('val').should('eq', '2 000')
		})
	})
}
