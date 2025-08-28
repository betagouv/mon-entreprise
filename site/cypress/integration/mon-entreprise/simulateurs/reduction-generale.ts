import { round } from '../../../../source/utils/number'
import { checkA11Y, fr, getAmountFromText } from '../../../support/utils'

describe(
	'Simulateur réduction générale',
	{ testIsolation: false },
	function () {
		if (!fr) {
			return
		}

		const inputSelector =
			'div[id="simulator-legend"] input[inputmode="numeric"]'
		const inputAmount = '{selectall}1900'
		const idPrefix = 'salarié___cotisations___exonérations___réduction_générale'
		let baseAmount: number
		let roundedBaseAmount: number

		before(function () {
			return cy.visit('/simulateurs/réduction-générale')
		})

		it('should not crash', function () {
			cy.contains('Réduction générale mois par mois :')
			cy.get(inputSelector).should('have.length', 12)
		})

		it('should display values for the réduction générale', function () {
			cy.get(inputSelector).first().type(inputAmount)

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(500)
					baseAmount = amount
					roundedBaseAmount = Math.round(amount)
				})

			cy.get(`#${idPrefix}-janvier`).trigger('mouseover')
			cy.contains('Détail du montant').should('be.visible')

			let IRCAmount: number
			cy.get(`p[id="${idPrefix}-janvier-IRC-value"]`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(0)
					expect(amount).to.be.lessThan(baseAmount)
					IRCAmount = amount
				})

			let UrssafAmount: number
			cy.get(`p[id="${idPrefix}-janvier-ISS-value"]`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(IRCAmount)
					expect(amount).to.be.lessThan(baseAmount)
					UrssafAmount = amount
					expect(UrssafAmount + IRCAmount).to.be.equal(baseAmount)
				})

			cy.get(`p[id="${idPrefix}-janvier-IC-value"]`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(0)
					expect(amount).to.be.lessThan(UrssafAmount)
					expect(round(amount / UrssafAmount, 2)).to.be.equal(0.15) // chômage =~ 15% part Urssaf
				})
		})

		it('should allow to select a company size', function () {
			cy.contains('Plus de 50 salariés').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[data-cy="modal"]')
				.first()
				.contains('Effectif')
				.next()
				.contains('100')
			cy.get('div[data-cy="modal"]').first().contains('Fermer').click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
				})

			cy.contains('Moins de 50 salariés').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[data-cy="modal"]')
				.first()
				.contains('Effectif')
				.next()
				.contains('10')
			cy.get('div[data-cy="modal"]').first().contains('Fermer').click()
		})

		it('should allow to select an option for caisse de congés payés', function () {
			cy.get('div[aria-labelledby="caisse-congés-payés-label"]')
				.contains('Oui')
				.click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
				})

			cy.get('div[aria-labelledby="caisse-congés-payés-label"]')
				.contains('Non')
				.click()
		})

		it('should display a warning for a remuneration too high', function () {
			cy.get(inputSelector).first().type('{selectall}3000')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'La RGCP concerne uniquement les salaires inférieurs à 1,6 Smic.'
			).should('be.visible')
		})

		it('should calculate RGCP month by month independently', function () {
			cy.get(inputSelector).first().type(inputAmount)
			cy.get(inputSelector).eq(1).type('{selectall}2000')

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.equal(baseAmount)
				})
			cy.get(`#${idPrefix}-février`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(baseAmount)
					expect(round(amount / baseAmount, 2)).to.be.equal(0.9) // RGCP pour 2000€ =~ 90% * RGCP pour 1900€
				})
		})

		it('should include progressive regularisation', function () {
			cy.get(inputSelector).each(($input) => {
				cy.wrap($input).type(inputAmount)
			})
			cy.get(inputSelector).eq(1).type('{selectall}4000')

			cy.get(`#${idPrefix}-février`).should('include.text', '0 €')
			cy.get(`#${idPrefix}__régularisation-février`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(0)
				})

			cy.get(`#${idPrefix}-mars`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(baseAmount)
				})

			cy.get(`#${idPrefix}__régularisation-décembre`).should('not.exist')
			cy.get(`#${idPrefix}-décembre`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
				})
		})

		it('should include annual regularisation', function () {
			cy.contains('Régularisation annuelle').click()

			cy.get(`#${idPrefix}-février`).should('include.text', '0 €')
			cy.get(`#${idPrefix}__régularisation-février`).should('not.exist')

			cy.get(`#${idPrefix}-mars`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
				})

			cy.get(`#${idPrefix}-décembre`).should('include.text', '0 €')
			cy.get(`#${idPrefix}__régularisation-décembre`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(0)
				})
		})

		it('should include monthly options', function () {
			cy.get(
				'div[id="simulator-legend"] button[aria-describedby="options-description"]'
			)
				.should('have.length', 12)
				.first()
				.click()
			cy.get('input[id="option-heures-sup-janvier"]')
				.should('be.visible')
				.type('{selectall}5')

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
				})
		})

		it('should handle incomplete months', function () {
			cy.get(inputSelector).first().type('{selectall}1500')
			cy.get('input[id="option-heures-sup-janvier"]').type('{selectall}5')
			cy.get('input[id="option-rémunération-etp-janvier"]')
				.should('be.visible')
				.type(inputAmount)
			cy.get('input[id="option-rémunération-primes-janvier"]')
				.should('be.visible')
				.type('{selectall}200')
			cy.get('input[id="option-rémunération-heures-sup-janvier"]')
				.should('be.visible')
				.type('{selectall}100')

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(baseAmount)
				})

			cy.get(
				'div[id="simulator-legend"] button[aria-describedby="options-description"]'
			)
				.first()
				.click()
		})

		it('should include a recap table', function () {
			cy.contains('Régularisation progressive').click()
			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'Récapitulatif trimestriel'
			)

			cy.get(inputSelector).each(($input, index) => {
				if (index > 2 && index < 6) {
					cy.wrap($input).type('{selectall}3000')
				}
			})
			cy.get('#recap-1er_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
					expect(amount).to.be.lessThan(2 * baseAmount)
				})
			cy.get('#recap-2ème_trimestre-régularisation')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(0)
				})
			cy.get('#recap-3ème_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(2.5 * baseAmount)
					expect(amount).to.be.lessThan(3.5 * baseAmount)
				})
			cy.get('#recap-4ème_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(2.5 * baseAmount)
					expect(amount).to.be.lessThan(3.5 * baseAmount)
				})
		})

		it('should be RGAA compliant', function () {
			checkA11Y()
		})
	}
)
