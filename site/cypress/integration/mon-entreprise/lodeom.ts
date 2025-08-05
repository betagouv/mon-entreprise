import { round } from '../../../source/utils/number'
import { checkA11Y, fr, getAmountFromText } from '../../support/utils'

describe('Simulateur lodeom', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'
	const inputAmount = '{selectall}3500'
	const idPrefix = 'salarié___cotisations___exonérations___lodeom___montant'
	let baseAmount: number
	let roundedBaseAmount: number

	before(function () {
		return cy.visit('/simulateurs/lodeom')
	})

	it('should not crash', function () {
		cy.contains('Quelle est votre localisation ?')
	})

	it('should display a warning when no zone is selected', function () {
		cy.contains(
			'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
		)
	})

	it('should display a warning when no scale is selected', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains(
			'Veuillez sélectionner une localisation et un barème pour accéder au simulateur.'
		)
	})

	it('should display values for the lodeom', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

		cy.get(inputSelector).should('have.length', 12)
		cy.get(inputSelector).first().type(inputAmount)

		cy.get(`#${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
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
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).first().type(inputAmount)

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

	it('should allow to select a scale', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité renforcée').click()
		cy.get(inputSelector).first().type(inputAmount)

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

	it('should allow to select a zone', function () {
		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
		cy.get(inputSelector).first().type(inputAmount)

		let baseAmountZone2: number
		cy.get(`${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
				baseAmountZone2 = amount
			})

		cy.contains('Barème d’exonération sectorielle').click()

		cy.get(`${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
				expect(amount).to.be.lessThan(baseAmountZone2)
			})

		cy.contains('Barème d’exonération renforcée').click()

		cy.get(`${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmountZone2)
			})
	})

	it('should not include repartition for zone 2', function () {
		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème d’exonération renforcée').click()
		cy.get(inputSelector).first().type(inputAmount)

		cy.get(`#${idPrefix}-janvier`).trigger('mouseover')
		cy.contains('Détail du montant').should('not.exist')
	})

	it('should display a custom warning for a remuneration too high', function () {
		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème d’exonération renforcée').click()
		cy.get(inputSelector).first().type('{selectall}8500')
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème d’exonération renforcée concerne uniquement les salaires inférieurs à 4,5 Smic.'
		).should('be.visible')

		cy.contains('Barème d’exonération sectorielle').click()
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème d’exonération sectorielle concerne uniquement les salaires inférieurs à 3 Smic.'
		).should('be.visible')

		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème pour les employeurs de moins de 11 salariés concerne uniquement les salaires inférieurs à 3 Smic.'
		).should('be.visible')

		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème d’innovation et croissance').click()
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème d’innovation et croissance concerne uniquement les salaires inférieurs à 3,5 Smic.'
		).should('be.visible')

		cy.contains('Barème de compétitivité renforcée').click()
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème de compétitivité renforcée concerne uniquement les salaires inférieurs à 2,7 Smic.'
		).should('be.visible')

		cy.contains('Barème de compétitivité').click()
		cy.get(`#${idPrefix}-janvier button`).first().trigger('mouseover')
		cy.contains(
			'Le barème de compétitivité concerne uniquement les salaires inférieurs à 2,2 Smic.'
		).should('be.visible')
	})

	it('should calculate Lodeom month by month independently', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).first().type(inputAmount)
		cy.get(inputSelector).eq(1).type('{selectall}3000')

		cy.get(`#${idPrefix}-janvier`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
			})
		cy.get(`#${idPrefix}-février`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
			})
	})

	it('should include progressive regularisation', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).each(($input) => {
			cy.wrap($input).type(inputAmount)
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
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

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
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

		cy.contains('Régularisation progressive').click()
		cy.get(inputSelector).first().type('{selectall}1500')
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
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Récapitulatif trimestriel'
		)

		cy.get(inputSelector).each(($input, index) => {
			if (index > 2 && index < 6) {
				cy.wrap($input).type('{selectall}4000')
			}
		})

		cy.get('#recap-1er_trimestre-réduction')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
				expect(amount).to.be.lessThan(baseAmount)
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

	it('should display code in recap table based on scale', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Régularisation progressive').click()

		cy.contains('Récapitulatif trimestriel').next().as('recapTable')

		cy.get('@recapTable').should('include.text', 'code 462')
		cy.get('@recapTable').should('include.text', 'code 684')

		cy.contains('Barème de compétitivité renforcée').click()

		cy.get('@recapTable').should('include.text', 'code 463')
		cy.get('@recapTable').should('include.text', 'code 538')

		cy.contains('Barème d’innovation et croissance').click()

		cy.get('@recapTable').should('include.text', 'code 473')
		cy.get('@recapTable').should('include.text', 'code 685')

		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

		cy.get('@recapTable').should('include.text', 'code 687')

		cy.contains('Barème d’exonération sectorielle').click()

		cy.get('@recapTable').should('include.text', 'code 686')

		cy.contains('Barème d’exonération renforcée').click()

		cy.get('@recapTable').should('include.text', 'code 688')
	})

	it('should not include regularization for zone 2', function () {
		cy.contains('régularisation', { matchCase: false }).should('not.exist')
	})

	it('should be RGAA compliant', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()

		checkA11Y()
	})
})
