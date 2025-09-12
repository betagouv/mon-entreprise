import { round } from '../../../../source/utils/number'
import { checkA11Y, fr, getAmountFromText } from '../../../support/utils'

/*
 * Notes :
 *
 * - Cypress ne lance pas forcément les tests dans l’ordre dans lequel ils sont
 *   écrits. C’est pourquoi on récupère la valeur "de base" à chaque test plutôt
 *   que de la stocker globalement.
 *
 * - On répète également l’assertion `expect(baseAmount).to.be.greaterThan(0)`
 *   afin d’éviter que Cypress n’enregistre la valeur avant mise à jour (soit 0)
 *   comme valeur de base.
 */
describe('Simulateur lodeom', function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'
	const inputAmount = '{selectall}3500'
	const idPrefix = 'salarié___cotisations___exonérations___lodeom___montant'

	beforeEach(function () {
		return cy.visit('/simulateurs/lodeom')
	})

	it('devrait s’afficher', function () {
		cy.contains('Quelle est votre localisation ?')
	})

	it('devrait afficher un avertissement lorsqu’aucune zone n’est sélectionnée', function () {
		cy.contains(
			'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
		)
	})

	it('devrait calculer l’exonération indépendemment pour chaque mois', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).first().type(inputAmount)

		let baseAmount: number
		cy.get(`#${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				baseAmount = getAmountFromText($text)
				expect(baseAmount).to.be.greaterThan(0)
			})

		cy.get(inputSelector).eq(1).type('{selectall}3000')

		cy.get(`#${idPrefix}-février`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
			})
	})

	it('devrait inclure des options pour chaque mois', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

		cy.get(inputSelector).first().type(inputAmount)
		let baseAmount: number
		cy.get(`#${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				baseAmount = getAmountFromText($text)
				expect(baseAmount).to.be.greaterThan(0)
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
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).first().type(inputAmount)

		let baseAmount: number
		cy.get(`#${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				baseAmount = getAmountFromText($text)
				expect(baseAmount).to.be.greaterThan(0)
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
			.type('{selectall}3000')
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

	it('devrait respecter le RGAA', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).each(($input) => {
			cy.wrap($input).type(inputAmount)
		})

		checkA11Y()
	})

	describe('Pour Guadeloupe, Guyane, Martinique, La Réunion', function () {
		beforeEach(function () {
			cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		})

		it('devrait afficher un avertissement lorsqu’aucun barème n’est sélectionné', function () {
			cy.contains(
				'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
			)
		})

		it('devrait afficher les montants de l’exonération', function () {
			cy.contains('Barème de compétitivité').click()

			cy.get(inputSelector).should('have.length', 12)
			cy.get(inputSelector).first().type(inputAmount)

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
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
					UrssafAmount = getAmountFromText($text)
					expect(UrssafAmount).to.be.greaterThan(IRCAmount)
					expect(UrssafAmount).to.be.lessThan(baseAmount)
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

		it('devrait permettre de choisir un barème', function () {
			cy.contains('Barème de compétitivité').click()
			cy.get(inputSelector).first().type(inputAmount)

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
				})

			cy.contains('Barème de compétitivité renforcée').click()

			let upperAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
					upperAmount = amount
				})

			cy.contains('Barème d’innovation et croissance').click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
					expect(amount).to.be.lessThan(upperAmount)
				})
		})

		it('devrait permettre de choisir un effectif d’entreprise', function () {
			cy.contains('Barème de compétitivité').click()
			cy.get(inputSelector).first().type(inputAmount)
			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
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

		it('devrait inclure la régularisation progressive', function () {
			cy.contains('Barème de compétitivité').click()
			cy.get(inputSelector).each(($input) => {
				cy.wrap($input).type(inputAmount)
			})
			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
				})

			cy.get(inputSelector).eq(1).type('{selectall}4500')

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
					expect(amount).to.be.lessThan(baseAmount)
				})
		})

		it('devrait inclure la régularisation annuelle', function () {
			cy.contains('Barème de compétitivité').click()
			cy.get(inputSelector).each(($input) => {
				cy.wrap($input).type(inputAmount)
			})
			let roundedBaseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(0)
					roundedBaseAmount = Math.round(amount)
				})
			cy.get(inputSelector).eq(1).type('{selectall}4500')

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

		it('devrait afficher un avertissement adapté au barème sélectionné pour une rémunération trop élevée', function () {
			cy.contains('Barème de compétitivité').click()
			cy.get(inputSelector).first().type('{selectall}4000')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'Le barème de compétitivité concerne uniquement les salaires inférieurs à 2,2 Smic.'
			).should('be.visible')

			cy.contains('Barème de compétitivité renforcée').click()
			cy.get(inputSelector).first().type('{selectall}4900')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'Le barème de compétitivité renforcée concerne uniquement les salaires inférieurs à 2,7 Smic.'
			).should('be.visible')

			cy.contains('Barème d’innovation et croissance').click()
			cy.get(inputSelector).first().type('{selectall}6400')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'Le barème d’innovation et croissance concerne uniquement les salaires inférieurs à 3,5 Smic.'
			).should('be.visible')
		})

		it('devrait inclure un tableau récapitulatif', function () {
			cy.contains('Barème de compétitivité').click()

			cy.get(inputSelector).each(($input, index) => {
				if (index > 2 && index < 6) {
					cy.wrap($input).type('{selectall}4000')
				} else {
					cy.wrap($input).type(inputAmount)
				}
			})

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
				})

			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'Récapitulatif trimestriel'
			)

			cy.get('#recap-1er_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(Math.round(amount)).to.be.equal(Math.round(3 * baseAmount))
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
					expect(amount).to.be.lessThan(3 * baseAmount)
				})
			cy.get('#recap-4ème_trimestre-réduction')
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(2.75 * baseAmount)
					expect(amount).to.be.lessThan(3.25 * baseAmount)
				})
		})

		it('devrait afficher un code en fonction du barème sélectionné dans le tableau récapitulatif', function () {
			cy.contains('Barème de compétitivité').click()
			cy.contains('Récapitulatif trimestriel').next().as('recapTable')

			cy.get('@recapTable').should('include.text', 'code 462')
			cy.get('@recapTable').should('include.text', 'code 684')

			cy.contains('Barème de compétitivité renforcée').click()

			cy.get('@recapTable').should('include.text', 'code 463')
			cy.get('@recapTable').should('include.text', 'code 538')

			cy.contains('Barème d’innovation et croissance').click()

			cy.get('@recapTable').should('include.text', 'code 473')
			cy.get('@recapTable').should('include.text', 'code 685')
		})
	})

	describe('Pour Saint-Barthélémy, Saint-Martin', function () {
		beforeEach(function () {
			cy.contains('Saint-Barthélémy, Saint-Martin').click()
		})

		it('devrait afficher un avertissement lorsqu’aucun barème n’est sélectionné', function () {
			cy.contains(
				'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
			)
		})

		it('devrait afficher les montants de l’exonération', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

			cy.get(inputSelector).should('have.length', 12)
			cy.get(inputSelector).first().type(inputAmount)

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(0)
				})
		})

		it('devrait permettre de choisir un barème', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
			cy.get(inputSelector).first().type(inputAmount)

			let baseAmount: number
			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					baseAmount = getAmountFromText($text)
					expect(baseAmount).to.be.greaterThan(0)
				})

			cy.contains('Barème d’exonération sectorielle').click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.lessThan(baseAmount)
				})

			cy.contains('Barème d’exonération renforcée').click()

			cy.get(`#${idPrefix}-janvier`)
				.invoke('text')
				.should(($text) => {
					const amount = getAmountFromText($text)
					expect(amount).to.be.greaterThan(baseAmount)
				})
		})

		it('ne devrait pas inclure la répartition de l’exonération', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
			cy.get(inputSelector).first().type(inputAmount)

			cy.get(`#${idPrefix}-janvier`).trigger('mouseover')
			cy.contains('Détail du montant').should('not.exist')
		})

		it('ne devrait pas inclure de régularisation', function () {
			cy.contains('régularisation', { matchCase: false }).should('not.exist')
		})

		it('devrait afficher un avertissement adapté au barème sélectionné pour une rémunération trop élevée', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
			cy.get(inputSelector).first().type('{selectall}5500')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'Le barème pour les employeurs de moins de 11 salariés concerne uniquement les salaires inférieurs à 3 Smic.'
			).should('be.visible')

			cy.contains('Barème d’exonération sectorielle').click()
			cy.get(inputSelector).first().click()
			cy.get(inputSelector).first().type('{selectall}5500')

			cy.get(`#${idPrefix}-janvier button`, { timeout: 8000 })
				.first()
				.trigger('mouseover')
			cy.contains(
				'Le barème d’exonération sectorielle concerne uniquement les salaires inférieurs à 3 Smic.'
			).should('be.visible')

			cy.contains('Barème d’exonération renforcée').click()
			cy.get(inputSelector).first().click()
			cy.get(inputSelector).first().type('{selectall}8200')

			cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
			cy.contains(
				'Le barème d’exonération renforcée concerne uniquement les salaires inférieurs à 4,5 Smic.'
			).should('be.visible')
		})

		it('devrait inclure un tableau récapitulatif', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'Récapitulatif trimestriel'
			)
		})

		it('devrait afficher un code en fonction du barème sélectionné dans le tableau récapitulatif', function () {
			cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
			cy.contains('Récapitulatif trimestriel').next().as('recapTable')

			cy.get('@recapTable').should('include.text', 'code 687')

			cy.contains('Barème d’exonération sectorielle').click()

			cy.get('@recapTable').should('include.text', 'code 686')

			cy.contains('Barème d’exonération renforcée').click()

			cy.get('@recapTable').should('include.text', 'code 688')
		})
	})
})
