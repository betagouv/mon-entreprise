const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'

describe('Simulateur auto-entrepreneur', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/auto-entrepreneur'))

	it('should allow to enter the date of creation', () => {
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Début 2021').click()
		cy.contains('ACRE')
	})
	it('should not have negative value', () => {
		cy.contains('Mensuel').click()
		cy.wait(100)
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.wait(800)
		cy.get(inputSelector).each(($input) => {
			const val = +$input.val().replace(/[\s,.]/g, '')
			expect(val).not.to.be.below(4000)
		})
	})
})
