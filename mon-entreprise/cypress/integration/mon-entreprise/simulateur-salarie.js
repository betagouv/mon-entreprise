const fr = Cypress.env('language') === 'fr'

describe('Simulateur salarié', () => {
	if (!fr) {
		return
	}
	before(() => cy.visit(encodeURI('/simulateurs/salarié')))

	describe('part time contract', () => {
		before(() => {
			cy.get('button').contains('SMIC').click()
			cy.contains('Voir mes paramètres').click()
			cy.get('div[role="dialog"]').contains('Temps partiel').click()
			cy.contains('Oui').click()
			cy.wait(100)
		})

		it('should permit selecting the smic before part-time contrat', () => {
			cy.get(
				'#contrat\\ salarié\\ \\.\\ rémunération\\ \\.\\ brut\\ de\\ base'
			).should(($input) => {
				expect(+$input.val().replace(/[\s,.€]/g, ''))
					.to.be.above(1300)
					.and.to.be.below(1500)
			})
		})

		it('should permit customizing the number of worked hours and clear the input value', () => {
			cy.contains('Suivant').click()
			cy.focused().type(25)
			cy.get(
				'#contrat\\ salarié\\ \\.\\ rémunération\\ \\.\\ net\\ après\\ impôt'
			).should(($input) => {
				expect(+$input.val().replace(/[\s,.€]/g, '')).to.be.below(1000)
			})

			cy.focused().clear()
			cy.get(
				'#contrat\\ salarié\\ \\.\\ rémunération\\ \\.\\ net\\ après\\ impôt'
			).should(($input) => {
				expect(+$input.val().replace(/[\s,.€]/g, '')).to.be.above(1000)
			})
		})
	})
})
