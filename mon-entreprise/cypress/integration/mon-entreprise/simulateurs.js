const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'
const chargeInputSelector = 'input.currencyInput__input[name$="charges"]'
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
						cy.get(chargeInputSelector).type(1000)
					}
					cy.get(inputSelector).each((testedInput, i) => {
						cy.wrap(testedInput).type('{selectall}60000')
						cy.wait(800)
						cy.contains('Cotisations')
						cy.get(inputSelector).each(($input, j) => {
							const val = $input.val().replace(/[\s,.]/g, '')
							if (i != j) {
								expect(val).not.to.be.eq('60000')
							}
							expect(val).to.match(/[1-9][\d]{3,6}$/)
						})
					})
				})

				it('should allow to change period', function() {
					cy.contains('€/an').click()
					cy.wait(200)
					cy.get(inputSelector)
						.first()
						.type('{selectall}12000')
					if (['indépendant', 'assimilé-salarié'].includes(simulateur)) {
						cy.get(chargeInputSelector).type('{selectall}6000')
					}
					cy.wait(800)
					cy.contains('€/mois').click()
					cy.get(inputSelector)
						.first()
						.invoke('val')
						.should('match', /1[\s]000/)
					if (['indépendant', 'assimilé-salarié'].includes(simulateur)) {
						cy.get(chargeInputSelector)
							.first()
							.invoke('val')
							.should('be', '500')
					}
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

				if (simulateur === 'auto-entrepreneur') {
					it('should allow to enter the date of creation', () => {
						cy.get(inputSelector)
							.first()
							.type('{selectall}50000')
						cy.contains('Passer').click()
						cy.contains('Passer').click()
						cy.contains('Début 2020').click()
						cy.wait(200)
						cy.contains('Suivant').click()
						cy.contains('ACRE')
					})
					it('should not have negative value', () => {
						cy.contains('€/mois').click()
						cy.get(inputSelector)
							.first()
							.type('{selectall}5000')
						cy.wait(800)
						cy.get(inputSelector).each($input => {
							const val = +$input.val().replace(/[\s,.]/g, '')
							expect(val).not.to.be.below(4000)
						})
					})
				}
			})
	)
})

describe('Simulateur salarié', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit('/simulateurs/salarié'))

	it.skip('should save the current simulation', function() {
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

	it('should ask for CDD motif directly after CDD is selected', function() {
		cy.get(inputSelector)
			.eq(1)
			.type('{selectall}3000')
		cy.wait(1000)
		cy.get('.step')
			.find('input[value="\'CDD\'"]')
			.click({ force: true })
		cy.contains('Suivant').click()
		cy.contains('Motifs classiques')
	})

	it('should not crash when selecting localisation', function() {
		cy.contains('Commune').click()
		cy.get('input[placeholder="Saisissez le nom d\'une commune"]').type(
			'Steenvoorde'
		)
		cy.contains('Steenvoorde (Nord)').click()
		cy.wait(900)
		cy.contains('Voir toutes les questions').click()
		cy.contains('Steenvoorde')
	})
})
