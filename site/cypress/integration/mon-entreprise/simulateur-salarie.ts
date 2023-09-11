import { checkA11Y, fr } from '../../support/utils'

describe('Simulateur salarié : part time contract', function () {
	if (!fr) {
		return
	}

	beforeEach(function () {
		cy.visit(encodeURI('/simulateurs/salaire-brut-net'))
		cy.get('button').contains('SMIC').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[title="modal"]')
			.eq(0)
			.contains('Temps partiel')
			.next()
			.find('button')
			.click()

		cy.get('div[title="modal"]').eq(1).contains('Fermer')
		cy.get('div[title="modal"]').eq(1).contains('Oui').click()
		cy.get('div[title="modal"]').eq(1).contains('Continuer').click()
		cy.get('div[title="modal"]').eq(0).contains('Fermer').click()
	})

	it('should permit selecting the smic before part-time contrat', function () {
		cy.get('#salarié___contrat___salaire_brut').should(($input) => {
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
		// eslint-disable-next-line cypress/unsafe-to-chain-command
		cy.focused().type('25')
		cy.contains('Fermer').click()

		cy.get('#salarié___rémunération___net___payé_après_impôt').should(
			($input) => {
				const val = $input
					.val()
					.toString()
					.replace(/[\s,.€]/g, '')
				expect(parseInt(val)).to.be.below(1000)
			}
		)
	})

	it('should be RGAA compliant', function () {
		checkA11Y()
	})
})
