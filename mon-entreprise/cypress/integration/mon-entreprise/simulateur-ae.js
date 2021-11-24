const fr = Cypress.env('language') === 'fr'
const inputSelector =
	'div[aria-labelledby="simulator-legend"] input[inputmode="numeric"]'

describe('Simulateur auto-entrepreneur', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/auto-entrepreneur'))

	it('should allow to enter the date of creation', () => {
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('Passer').click()
		cy.contains('Début 2021').click()
		cy.contains('ACRE')
	})
	it('should not have negative value', () => {
		cy.contains('Mensuel').click()
		cy.wait(100)
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.get(inputSelector).each(($input) => {
			cy.wrap($input).should(($i) => {
				const val = +$i.val().replace(/[\s,.€]/g, '')
				expect(val).not.to.be.below(4000)
			})
		})
	})
})
