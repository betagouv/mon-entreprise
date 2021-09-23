const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'

describe('Persistence (simulateur salarié)', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))
	beforeEach(() => {
		cy.clearLocalStorage()
	})

	it('should persist the current simulation (persistSimulation)', function () {
		cy.get(inputSelector).first().type('{selectall}42')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.get('body').should(() => {
			expect(
				window.localStorage.getItem(
					'mon-entreprise::persisted-simulation::v5::/simulateurs/salaire-brut-net'
				)
			).to.be.not.null
		})
		cy.visit('/simulateurs/auto-entrepreneur')
		cy.get(inputSelector).first().type('{selectall}007')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.visit(encodeURI('/simulateurs/salarié'))
		cy.contains('Retrouver ma simulation').click()
		cy.get(inputSelector).first().invoke('val').should('match', /42/)
	})
})
