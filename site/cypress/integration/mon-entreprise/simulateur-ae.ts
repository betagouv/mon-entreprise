import { fr } from '../../support/utils'

describe('Simulateur auto-entrepreneur', function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	before(function () {
		return cy.visit('/simulateurs/auto-entrepreneur')
	})

	it('should allow to enter the date of creation', function () {
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('Passer').click()
		cy.contains('Passer').click()
		cy.contains('Début 2022').click()
		cy.contains('ACRE')
	})

	it('should not have negative value', function () {
		cy.contains('Mensuel').click()
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.get(inputSelector).each(($input) => {
			cy.wrap($input).should(($i) => {
				const val = $i
					.val()
					.toString()
					.replace(/[\s,.€]/g, '')
				expect(parseInt(val)).not.to.be.below(4000)
			})
		})
	})
})
