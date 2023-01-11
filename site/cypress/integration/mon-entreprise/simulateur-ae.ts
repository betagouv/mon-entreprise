import { checkA11Y, fr } from '../../support/utils'

describe('Simulateur auto-entrepreneur', { testIsolation: 'off' }, function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	before(function () {
		return cy.visit('/simulateurs/auto-entrepreneur')
	})

	it('should allow to enter the date of creation', function () {
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('button', 'Passer').click()
		cy.contains('button', 'Passer').click()
		cy.contains('Début 2023').click()
		cy.contains('ACRE')
	})

	it('should not have negative value', function () {
		cy.contains('Montant mensuel').click()
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

	it('should show a "Activité mixte" button which that shows three entries', function () {
		cy.get(inputSelector)
			.its('length')
			.then((length) => {
				cy.contains('Activité mixte').click()

				cy.get(inputSelector).should('have.length', length + 3)
			})
	})

	it('should display the correct CA when changing the second "Activité mixte"', function () {
		cy.get(inputSelector).eq(2).type('{selectall}5000')

		cy.get(inputSelector).first().should('have.value', '10 000 €')
	})

	const parseActivitéMixtes = (elems: HTMLInputElement[]) =>
		elems
			.slice(1, 4)
			.map((elem) => parseInt(elem.value.replace(/[\s,.€]/g, '')))

	it('should display the correct results of "Activité mixte" when changing CA', function () {
		cy.get(inputSelector).first().type('{selectall}5000')

		cy.get<HTMLInputElement>(inputSelector).should(($elem) => {
			const activitéMixtes = parseActivitéMixtes($elem.toArray())

			expect(activitéMixtes).to.deep.equal([1250, 2500, 1250])
		})
	})

	it('should display the correct results of "Activité mixte" when changing "Revenu net Après impôt"', function () {
		cy.get(inputSelector).last().type('{selectall}2500')

		cy.get<HTMLInputElement>(inputSelector).should(($elem) => {
			const activitéMixtes = parseActivitéMixtes($elem.toArray())

			expect(activitéMixtes[0]).to.be.equal(activitéMixtes[2])
			expect(activitéMixtes[1]).to.be.equal(activitéMixtes[0] * 2)
		})
	})

	it('should be RGAA compliant', function () {
		checkA11Y()
	})
})
