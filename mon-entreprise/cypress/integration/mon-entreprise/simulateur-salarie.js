const fr = Cypress.env('language') === 'fr'

describe('Simulateur salarié', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))

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
				expect(+$input.val().replace(/[\s,.€]/g, ''))
					.to.be.above(1300)
					.and.to.be.below(1500)
			})
		})

		it('should permit customizing the number of worked hours and clear the input value', () => {
			cy.contains('Suivant').click()
			cy.get('fieldset input[type="text"]').type(25)
			cy.get('input[name$="net après impôt"]').should(($input) => {
				expect(+$input.val().replace(/[\s,.€]/g, '')).to.be.below(1000)
			})

			cy.get('fieldset input[type="text"]').clear()
			cy.get('input[name$="net après impôt"]').should(($input) => {
				expect(+$input.val().replace(/[\s,.€]/g, '')).to.be.above(1000)
			})
		})
	})
})
