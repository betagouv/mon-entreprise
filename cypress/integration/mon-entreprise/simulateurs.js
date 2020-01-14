const fr = Cypress.env('language') === 'fr'
const inputSelector =
	'input.currencyInput__input:not([name$="charges"]):not([name*="dépenses"])'
describe('Simulateurs', function() {
	if (!fr) {
		return
	}
	;['indépendant', 'assimilé-salarié', 'auto-entrepreneur', 'salarié'].forEach(
		simulateur =>
			describe(simulateur, () => {
				before(() => cy.visit(`/simulateurs/${simulateur}`))
				it('should not crash', function() {
					cy.get(inputSelector)
				})

				it('should display a result when entering a value in any of the currency input', () => {
					cy.contains('€/an').click()
					if (['indépendant', 'assimilé-salarié'].includes(simulateur)) {
						cy.get('input.currencyInput__input[name$="charges"]').type(1000)
					}
					if (simulateur === 'auto-entrepreneur') {
						cy.get('input.currencyInput__input[name*="dépenses"]').type(1000)
					}
					cy.get(inputSelector).each((testedInput, i) => {
						cy.wrap(testedInput).type('{selectall}60000')
						cy.wait(600)
						cy.contains('Cotisations')
						cy.get(inputSelector).each(($input, j) => {
							const val = $input.val().replace(/[\s,.]/g, '')
							if (i != j) {
								expect(val).not.to.be.eq('60000')
							}
							expect(val).to.match(/[1-9][\d]*$/)
						})
					})
				})

				it('should allow to change period', function() {
					cy.contains('€/an').click()
					cy.wait(200)
					cy.get(inputSelector)
						.first()
						.type('{selectall}12000')
					cy.wait(600)
					cy.contains('€/mois').click()
					cy.get(inputSelector)
						.first()
						.invoke('val')
						.should('match', /1[\s]000/)
				})

				it('should allow to navigate to a documentation page', function() {
					cy.get(inputSelector)
						.first()
						.type('{selectall}2000')
					cy.wait(700)
					cy.contains('Cotisations').click()
					cy.location().should(loc => {
						expect(loc.pathname).to.match(/\/documentation\/.*\/cotisations/)
					})
				})

				it('should allow to go back to the simulation', function() {
					cy.contains('← ').click()
					cy.get(inputSelector)
						.first()
						.invoke('val')
						.should('be', '2 000')
				})

				if (simulateur === 'salarié') {
					it('should save the current simulation', function() {
						cy.get(inputSelector)
							.first()
							.type('{selectall}2137')
						cy.contains('Passer').click()
						cy.contains('Passer').click()
						cy.contains('Passer').click()
						cy.wait(1600)
						cy.visit('/simulateurs/salarié')
						cy.contains('Retrouver ma simulation').click()
						cy.get(inputSelector)
							.first()
							.invoke('val')
							.should('match', /2[\s]137/)
					})
				}
			})
	)
})
