import { fr } from '../../support/utils'

describe('Simulateur salarié', function () {
	if (!fr) {
		return
	}

	before(function () {
		return cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
	})

	describe('part time contract', function () {
		before(function () {
			cy.get('button').contains('SMIC').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[role="dialog"]')
				.contains('Temps partiel')
				.next()
				.find('button')
				.click()

			cy.get('div[role="dialog"]').contains('Oui').click()
			cy.get('div[role="dialog"]').contains('Continuer').click()
			cy.get('div[role="dialog"]').contains('Fermer').click()
		})

		it('should permit selecting the smic before part-time contrat', function () {
			cy.get('#salariécontratsalairebrut').should(($input) => {
				const val = $input
					.val()
					.toString()
					.replace(/[\s,.€]/g, '')
				expect(parseInt(val)).to.be.above(1300).and.to.be.below(1600)
			})
		})

		it('should permit customizing the number of worked hours and clear the input value', function () {
			cy.contains('Modifier mes réponses').click()

			cy.get('div[role="dialog"]')
				.contains('Heures par semaine')
				.next()
				.find('button')
				.click()
			cy.focused().type('25')
			cy.contains('Fermer').click()

			cy.get('#salariérémunérationnetpayéaprèsimpôt').should(($input) => {
				const val = $input
					.val()
					.toString()
					.replace(/[\s,.€]/g, '')
				expect(parseInt(val)).to.be.below(1000)
			})
		})
	})
})
