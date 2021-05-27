const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'
const chargeInputSelector = 'input.currencyInput__input[name$="charges"]'
describe('Simulateurs', function () {
	if (!fr) {
		return
	}
	;[
		'indépendant',
		'dirigeant-sasu',
		'auto-entrepreneur',
		'salarié',
		'profession-liberale',
		'profession-liberale/medecin',
		'profession-liberale/sage-femme',
		'profession-liberale/auxiliaire-medical',
		'profession-liberale/chirurgien-dentiste',
	].forEach((simulateur) =>
		describe(simulateur, () => {
			before(() => cy.visit(encodeURI(`/simulateurs/${simulateur}`)))
			it('should not crash', function () {
				cy.get(inputSelector)
			})

			it('should display a result when entering a value in any of the currency input', () => {
				cy.contains('Annuel').click()
				if (['indépendant', 'profession-liberale'].includes(simulateur)) {
					cy.get(chargeInputSelector).type(1000)
				}
				cy.get(inputSelector).each((testedInput, i) => {
					cy.wrap(testedInput).type('{selectall}60111')
					cy.wait(1500)
					cy.contains('Cotisations')
					cy.get(inputSelector).each(($input, j) => {
						const val = $input.val().replace(/[\s,.]/g, '')
						if (i != j) {
							expect(val).not.to.be.eq('60111')
						}
						expect(val).to.match(/[1-9][\d]{3,6}$/)
					})
				})
			})

			it('should allow to change period', function () {
				cy.contains('Annuel').click()
				cy.wait(200)
				cy.get(inputSelector).first().type('{selectall}12000')
				if (['indépendant', 'profession-liberale'].includes(simulateur)) {
					cy.get(chargeInputSelector).type('{selectall}6000')
				}
				cy.wait(800)
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
				cy.wait(700)
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
	)
})
