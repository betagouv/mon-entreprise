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

	it('should allow to change time period', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().type(inputAmount)

		cy.contains('Exonération annuelle').click()
		cy.get(inputSelector).first().should('have.value', '42 000 €')
	})

	it('should display values for the lodeom', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().type(inputAmount)

		cy.get(`p[id="${idPrefix}-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
				baseAmount = amount
				roundedBaseAmount = Math.round(amount)
			})

		let UrssafAmount: number
		cy.get(`p[id="${idPrefix}___imputation_sécurité_sociale-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
				expect(amount).to.be.lessThan(baseAmount)
				UrssafAmount = amount
			})

		let IRCAmount: number
		cy.get(`p[id="${idPrefix}___imputation_retraite_complémentaire-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
				expect(amount).to.be.lessThan(UrssafAmount)
				IRCAmount = amount
			})

		cy.get(`p[id="${idPrefix}___imputation_chômage-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(0)
				expect(amount).to.be.lessThan(IRCAmount)
			})
	})

	it('should allow to select a company size', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().type(inputAmount)

		cy.contains('Plus de 50 salariés').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.first()
			.contains('Effectif')
			.next()
			.contains('100')
		cy.get('div[data-cy="modal"]').first().contains('Fermer').click()

		cy.get(`p[id="${idPrefix}-value"]`)
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
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().type(inputAmount)

		let upperAmount: number
		cy.get(`p[id="${idPrefix}-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
				upperAmount = amount
			})

		cy.contains('Barème d’innovation et croissance').click()

		cy.get(`p[id="${idPrefix}-value"]`)
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
		cy.get(`p[id="${idPrefix}-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
				baseAmountZone2 = amount
			})

		cy.contains('Barème d’exonération sectorielle').click()

		cy.get(`p[id="${idPrefix}-value"]`)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
				expect(amount).to.be.lessThan(baseAmountZone2)
			})

		cy.contains('Barème d’exonération renforcée').click()

		cy.get(`p[id="${idPrefix}-value"]`)
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

		cy.get(
			`p[id="${idPrefix}___imputation_retraite_complémentaire-value"]`
		).should('not.exist')
		cy.get(`p[id="${idPrefix}___imputation_sécurité_sociale-value"]`).should(
			'not.exist'
		)
		cy.get(`p[id="${idPrefix}___imputation_chômage-value"]`).should('not.exist')
	})

	it('should display a custom warning for a remuneration too high', function () {
		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème d’exonération renforcée').click()
		cy.get(inputSelector).first().type('{selectall}8500')

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème d’exonération renforcée concerne uniquement les salaires inférieurs à 4,5 Smic.'
		)

		cy.contains('Barème d’exonération sectorielle').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème d’exonération sectorielle concerne uniquement les salaires inférieurs à 3 Smic.'
		)

		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème pour les employeurs de moins de 11 salariés concerne uniquement les salaires inférieurs à 3 Smic.'
		)

		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème d’innovation et croissance').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème d’innovation et croissance concerne uniquement les salaires inférieurs à 3,5 Smic.'
		)

		cy.contains('Barème de compétitivité renforcée').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème de compétitivité renforcée concerne uniquement les salaires inférieurs à 2,7 Smic.'
		)

		cy.contains('Barème de compétitivité').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème de compétitivité concerne uniquement les salaires inférieurs à 2,2 Smic.'
		)
	})

	it('should display remuneration and Lodeom month by month', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().type(inputAmount)

		cy.contains('Exonération mois par mois').click()
		cy.contains('Exonération Lodeom mois par mois :')

		cy.get(inputSelector)
			.should('have.length', 12)
			.each(($input) => {
				cy.wrap($input).should('have.value', '3 500 €')
			})
		cy.get('[id^="salarié___cotisations___exonérations___lodeom___montant-"]')
			.should('have.length', 12)
			.each(($input) => {
				cy.wrap($input)
					.invoke('text')
					.should(($text) => {
						const amount = getAmountFromText($text)
						// En cas de changement de paramètres en cours d'année (Smic, taux de cotisation...)
						// le montant de la réduction de chaque mois n'est pas exactement identique
						// on compare donc les montants arrondis à l'euro le plus proche
						expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
					})
			})
	})

	it('should calculate Lodeom month by month independently', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mois par mois').click()
		cy.get(inputSelector).eq(1).type('{selectall}3000')

		cy.get('#salarié___cotisations___exonérations___lodeom___montant-janvier')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
			})
		cy.get('#salarié___cotisations___exonérations___lodeom___montant-février')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
			})
	})

	it('should save remuneration between tabs', function () {
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().should('have.value', '3 458,33 €')
		cy.contains('Exonération annuelle').click()
		cy.get(inputSelector).first().should('have.value', '41 500 €')
		cy.contains('Exonération mois par mois').click()
		cy.get(inputSelector).each(($input, index) => {
			const expectedValue = index === 1 ? '3 000 €' : '3 500 €'
			cy.wrap($input).should('have.value', expectedValue)
		})
	})

	it('should include progressive regularisation', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mois par mois').click()
		cy.get(inputSelector).eq(1).type('{selectall}4500')

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-février'
		).should('include.text', '0 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-février'
		)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.lessThan(0)
			})

		cy.get('#salarié___cotisations___exonérations___lodeom___montant-mars')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.lessThan(baseAmount)
			})

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-décembre'
		).should('not.exist')
		cy.get('#salarié___cotisations___exonérations___lodeom___montant-décembre')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.lessThan(baseAmount)
			})
	})

	it('should include annual regularisation', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mois par mois').click()
		cy.contains('Régularisation annuelle').click()

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-février'
		).should('include.text', '0 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-février'
		).should('not.exist')

		cy.get('#salarié___cotisations___exonérations___lodeom___montant-mars')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(Math.round(amount)).to.be.equal(roundedBaseAmount)
			})

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-décembre'
		).should('include.text', '0 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-décembre'
		)
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.lessThan(0)
			})
	})

	it('should include monthly options', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mois par mois').click()

		cy.get(
			'div[id="simulator-legend"] button[aria-describedby="options-description"]'
		)
			.should('have.length', 12)
			.first()
			.click()
		cy.get('input[id="option-heures-sup-janvier"]')
			.should('be.visible')
			.type('{selectall}5')

		cy.get('#salarié___cotisations___exonérations___lodeom___montant-janvier')
			.invoke('text')
			.should(($text) => {
				const amount = getAmountFromText($text)
				expect(amount).to.be.greaterThan(baseAmount)
			})
	})

	it('should handle incomplete months', function () {
		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération mois par mois').click()

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

		cy.get('#salarié___cotisations___exonérations___lodeom___montant-janvier')
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
		cy.contains('Exonération mois par mois').click()

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
		cy.contains('Exonération mois par mois').click()

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

		cy.contains('Exonération mensuelle').click()
		checkA11Y()
		cy.contains('Exonération annuelle').click()
		checkA11Y()
		cy.contains('Exonération mois par mois').click()
		checkA11Y()
	})
})
