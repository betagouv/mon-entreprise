const fr = Cypress.env('language') === 'fr'
const inputSelector = 'input.currencyInput__input:not([name$="charges"])'

describe('Simulateur salarié', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))

	it('should persist the current simulation (persistSimulation)', function () {
		cy.get(inputSelector).first().type('{selectall}42')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.wait(1600)
		cy.visit('/simulateurs/auto-entrepreneur')
		cy.get(inputSelector).first().type('{selectall}007')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.wait(1600)
		cy.visit(encodeURI('/simulateurs/salarié'))
		cy.contains('Retrouver ma simulation').click()
		cy.get(inputSelector).first().invoke('val').should('match', /42/)
	})

	it('should not crash when selecting localisation', function () {
		cy.contains('Commune').click()
		cy.get('fieldset input[type="search"]').type('Steenvoorde')
		cy.contains('Steenvoorde (59114)').click()
		cy.contains('Suivant').click()
		cy.contains('Voir mes paramètres').click()
		cy.contains('Steenvoorde')
	})

	describe('part time contract', () => {
		before(() => {
			cy.visit(encodeURI('/simulateurs/salarié'))
			cy.get('input[name$="brut de base"]').click()
			cy.get('button').contains('SMIC').click()
			cy.contains('Voir mes paramètres').click()
			cy.contains('Temps partiel').click()
			cy.get('input[value="oui"]').parent().click()
			cy.wait(100)
		})

		it('should permit selecting the smic before part-time contrat', () => {
			cy.get('input[name$="brut de base"]').should(($input) => {
				expect(+$input.val().replace(/[\s,.]/g, ''))
					.to.be.above(1300)
					.and.to.be.below(1500)
			})
		})

		it('should permit customizing the number of worked hours and clear the input value', () => {
			cy.contains('Suivant').click()
			cy.get('fieldset input[type="text"]').type(25)
			cy.get('input[name$="net après impôt"]').should(($input) => {
				expect(+$input.val().replace(/[\s,.]/g, '')).to.be.below(1000)
			})

			cy.get('fieldset input[type="text"]').clear()
			cy.get('input[name$="net après impôt"]').should(($input) => {
				expect(+$input.val().replace(/[\s,.]/g, '')).to.be.above(1000)
			})
		})
	})
})
