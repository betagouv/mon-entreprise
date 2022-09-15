const inputSelector = 'div[id="simulator-legend"] input'
const fr = Cypress.env('language') === 'fr'
describe('Persistence (simulateur salarié)', function () {
	if (!fr) {
		return
	}
	before(function () {
		return cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
	})
	beforeEach(function () {
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
					'mon-entreprise::persisted-simulation::v6::/simulateurs/salaire-brut-net'
				)
			).to.be.not.null
		})
		cy.visit('/simulateurs/auto-entrepreneur')
		cy.get(inputSelector).first().type('{selectall}007')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
		cy.contains('Retrouver ma simulation').click()
		cy.get(inputSelector).first().invoke('val').should('match', /42/)
	})
})
