import { round } from '../../../../source/utils/number'
import { checkA11Y, fr, getAmountFromText } from '../../../support/utils'

describe(
	'Simulateur réduction générale',
	{ defaultCommandTimeout: 6000 },
	function () {
		if (!fr) {
			return
		}

		const inputSelector =
			'div[id="simulator-legend"] input[inputmode="numeric"]'
		const inputAmount = '{selectall}1900'
		const idPrefix = 'salarié___cotisations___exonérations___réduction_générale'

		beforeEach(function () {
			return cy.visit('/simulateurs/réduction-générale')
		})

		it('devrait s’afficher', function () {
			cy.contains('Réduction générale mois par mois :')
			cy.get(inputSelector).should('have.length', 12)
		})

		it('devrait afficher les montants de la réduction générale', function () {
			cy.get(inputSelector).first().type(inputAmount)

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(500)
					baseAmount = amount
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

		it('devrait permettre de choisir un effectif d’entreprise', function () {
			cy.get(inputSelector).first().type(inputAmount)
			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})

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
		})

		it('devrait permettre de choisir une option pour l’obligation de cotiser à une caisse de congés payés', function () {
			cy.get(inputSelector).first().type(inputAmount)
			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})

			cy.get('div[aria-labelledby="caisse-congés-payés-label"]')
				.contains('Oui')
				.click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
				})
		})

		it.skip('devrait afficher un avertissement pour une rémunération trop élevée', function () {
			cy.get(inputSelector).first().type('{selectall}3000')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'La RGCP concerne uniquement les salaires inférieurs à 1,6 Smic.'
			).should('be.visible')
		})

		it.skip('devrait calculer la réduction générale indépendemment pour chaque mois', function () {
			cy.get(inputSelector).first().type(inputAmount)
			cy.get(inputSelector).eq(1).type('{selectall}2000')

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})
			cy.get(`#${idPrefix}-février`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(baseAmount)
					expect(round(amount / baseAmount, 2)).to.be.equal(0.9) // RGCP pour 2000€ =~ 90% * RGCP pour 1900€
				})
		})

		it.skip('devrait inclure la régularisation progressive', function () {
			cy.get(inputSelector).each(($input) => {
				cy.wrap($input).type(inputAmount)
			})
			let baseAmount: number
			let roundedBaseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					roundedBaseAmount = Math.round(baseAmount)
					expect(baseAmount).to.be.greaterThan(500)
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

		it.skip('devrait inclure la régularisation annuelle', function () {
			cy.contains('Régularisation annuelle').click()
			cy.get('#input-radio-annuelle').should('be.checked')

			cy.get(inputSelector).each(($input) => {
				cy.wrap($input).type(inputAmount)
			})
			let roundedBaseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					roundedBaseAmount = Math.round(amount)
					expect(amount).to.be.greaterThan(500)
				})

			cy.get(inputSelector).eq(1).type('{selectall}4000')

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

		it.skip('devrait inclure des options pour chaque mois', function () {
			cy.get(inputSelector).first().type(inputAmount)

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})

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

		it('devrait gérer les mois incomplets', function () {
			cy.get(inputSelector).first().type(inputAmount)
			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})

			cy.get(inputSelector).first().click()
			cy.get(inputSelector).first().type('{selectall}1500')

			cy.get(
				'div[id="simulator-legend"] button[aria-describedby="options-description"]'
			)
				.first()
				.click()

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

			cy.get(`#${idPrefix}-janvier`, { timeout: 8000 })
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

		it.skip('devrait inclure un tableau récapitulatif', function () {
			cy.get(inputSelector).each(($input, index) => {
				cy.wrap($input).should('not.be.disabled')
				if (index > 2 && index < 6) {
					cy.wrap($input).type('{selectall}3000')
				} else {
					cy.wrap($input).type(inputAmount)
				}
			})

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(500)
				})

			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'Récapitulatif trimestriel'
			)

			cy.get('#recap-1er_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
					expect(amount).to.be.equal(3 * baseAmount)
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

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})
	}
)
