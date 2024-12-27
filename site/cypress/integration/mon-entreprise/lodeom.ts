import { checkA11Y, fr } from '../../support/utils'

describe('Simulateur lodeom', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	before(function () {
		return cy.visit('/simulateurs/lodeom')
	})

	it('should not crash', function () {
		cy.contains('Rémunération brute')
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
		cy.contains('Barème de compétitivité').click()
		cy.contains('Exonération annuelle').click()
		cy.get(inputSelector).first().type('{selectall}42000')

		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().should('have.value', '3 500 €')
	})

	it('should display values for the lodeom', function () {
		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '214,20 €')
		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant___imputation_retraite_complémentaire-value"]'
		).should('include.text', '40,31')
		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant___imputation_sécurité_sociale-value"]'
		).should('include.text', '173,89 €')
	})

	it('should allow to select a company size', function () {
		cy.contains('Plus de 50 salariés').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.eq(0)
			.contains('Effectif')
			.next()
			.contains('100')
		cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '216,65 €')

		cy.contains('Moins de 50 salariés').click()
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.eq(0)
			.contains('Effectif')
			.next()
			.contains('10')
		cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()
	})

	it('should allow to select a scale', function () {
		cy.contains('Barème de compétitivité renforcée').click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '1 117,90 €')

		cy.contains("Barème d'innovation et croissance").click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '978,25 €')
	})

<<<<<<< HEAD
<<<<<<< HEAD
=======
	it('should allow to select a zone', function () {
		cy.contains('Saint-Barthélémy, Saint-Martin').click()
		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '530,25 €')

		cy.contains("Barème d'exonération sectorielle").click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '350,35 €')

		cy.contains("Barème d'exonération renforcée").click()

		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant-value"]'
		).should('include.text', '644 €')
	})

<<<<<<< HEAD
>>>>>>> 85d9bc4b0 (feat(lodeom): ajout de la sélection de zone)
=======
	it('should not include repartition for zone 2', function () {
		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant___imputation_retraite_complémentaire-value"]'
		).should('not.exist')
		cy.get(
			'p[id="salarié___cotisations___exonérations___lodeom___montant___imputation_sécurité_sociale-value"]'
		).should('not.exist')
	})

>>>>>>> 7294137b4 (feat(lodeom): suppression de la répartition pour la zone 2)
	it('should display a custom warning for a remuneration too high', function () {
		cy.get(inputSelector).first().type('{selectall}8500')

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			"Le barème d'exonération renforcée uniquement les salaires inférieurs à 4,5 SMIC."
		)

		cy.contains("Barème d'exonération sectorielle").click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			"Le barème d'exonération sectorielle concerne uniquement les salaires inférieurs à 3 SMIC."
		)

		cy.contains('Barème pour les employeurs de moins de 11 salariés').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème pour les employeurs de moins de 11 salariés concerne uniquement les salaires inférieurs à 3 SMIC.'
		)

		cy.contains('Guadeloupe, Guyane, Martinique, La Réunion').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			"Le barème d'innovation et croissance concerne uniquement les salaires inférieurs à 3,5 SMIC."
		)

		cy.contains('Barème de compétitivité renforcée').click()

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème de compétitivité renforcée concerne uniquement les salaires inférieurs à 2,7 SMIC.'
		)

		cy.contains('Barème de compétitivité').click()
=======
	it('should display a warning for a remuneration too high', function () {
		cy.contains('Barème de compétitivité').click()
		cy.get(inputSelector).first().type('{selectall}4000')
>>>>>>> 3ef89d199 (tests(lodeom): ajout de tests sur les barèmes)

		cy.get('div[id="simulator-legend"]').should(
			'include.text',
			'Le barème de compétitivité concerne uniquement les salaires inférieurs à 2,2 SMIC.'
		)
	})

	it('should display remuneration and Lodeom month by month', function () {
		cy.contains('Exonération annuelle').click()
		cy.get(inputSelector).first().type('{selectall}36000')

		cy.contains('Exonération mois par mois').click()
		cy.contains('Exonération Lodeom mois par mois :')
<<<<<<< HEAD
=======

>>>>>>> 3ef89d199 (tests(lodeom): ajout de tests sur les barèmes)
		cy.get(inputSelector)
			.should('have.length', 12)
			.each(($input) => {
				cy.wrap($input).should('have.value', '3 000 €')
			})
		cy.get('[id^="salarié___cotisations___exonérations___lodeom___montant-"]')
			.should('have.length', 12)
			.each(($input) => {
				cy.wrap($input).should('include.text', '444,60 €')
			})
	})

	it('should calculate Lodeom month by month independently', function () {
		cy.get(inputSelector).eq(1).type('{selectall}3500')

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-janvier'
		).should('include.text', '444,60 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-février'
		).should('include.text', '214,50 €')
	})

	it('should save remuneration between tabs', function () {
		cy.contains('Exonération mensuelle').click()
		cy.get(inputSelector).first().should('have.value', '3 041,67 €')
		cy.contains('Exonération annuelle').click()
		cy.get(inputSelector).first().should('have.value', '36 500 €')
		cy.contains('Exonération mois par mois').click()
		cy.get(inputSelector).each(($input, index) => {
			let expectedValue = '3 000 €'
			if (index === 1) {
				expectedValue = '3 500 €'
			}
			cy.wrap($input).should('have.value', expectedValue)
		})
	})

	it('should include progressive regularisation', function () {
		cy.get(inputSelector).eq(1).type('{selectall}4500')

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-février'
		).should('include.text', '0 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-février'
		).should('include.text', '-247,35 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-mars'
		).should('include.text', '445,35 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-décembre'
		).should('include.text', '447,60 €')
	})

	it('should include annual regularisation', function () {
		cy.contains('Régularisation annuelle').click()

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-février'
		).should('include.text', '0 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant__régularisation-février'
		).should('not.exist')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-mars'
		).should('include.text', '444,60 €')
		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-décembre'
		).should('include.text', '200,25 €')
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
			.type('{selectall}18,35')

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-janvier'
		).should('include.text', '666 €')
	})

	it('should handle incomplete months', function () {
		cy.contains('Régularisation progressive').click()
		cy.get(inputSelector).first().type('{selectall}1500')
		cy.get('input[id="option-heures-sup-janvier"]').type('{selectall}5')
		cy.get(
			'div[id="simulator-legend"] p[aria-describedby="options-mois-incomplet-description"]'
		)
			.should('be.visible')
			.click()
		cy.get('input[id="option-rémunération-etp-janvier"]')
			.should('be.visible')
			.type('{selectall}3000')
		cy.get('input[id="option-rémunération-primes-janvier"]')
			.should('be.visible')
			.type('{selectall}200')
		cy.get('input[id="option-rémunération-heures-sup-janvier"]')
			.should('be.visible')
			.type('{selectall}100')

		cy.get(
			'#salarié___cotisations___exonérations___lodeom___montant-janvier'
		).should('include.text', '99,75 €')

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
				cy.wrap($input).type('{selectall}4000')
			}
		})

<<<<<<< HEAD
		cy.get('#recap-1er_trimestre-réduction').should('include.text', '297 €')
=======
		cy.get('#recap-1er_trimestre-réduction').should('include.text', '442 €')
>>>>>>> 3ef89d199 (tests(lodeom): ajout de tests sur les barèmes)
		cy.get('#recap-2ème_trimestre-régularisation').should(
			'include.text',
			'-49,20 €'
		)
		cy.get('#recap-3ème_trimestre-réduction').should(
			'include.text',
			'1 333,20 €'
		)
		cy.get('#recap-4ème_trimestre-réduction').should(
			'include.text',
			'1 336,20 €'
		)
	})

	it('should display code in recap table based on scale', function () {
		cy.contains('Récapitulatif trimestriel').next().as('recapTable')

		cy.get('@recapTable').should('include.text', 'code 462')
		cy.get('@recapTable').should('include.text', 'code 684')

		cy.contains('Barème de compétitivité renforcée').click()

		cy.get('@recapTable').should('include.text', 'code 463')
		cy.get('@recapTable').should('include.text', 'code 538')

		cy.contains("Barème d'innovation et croissance").click()

		cy.get('@recapTable').should('include.text', 'code 473')
		cy.get('@recapTable').should('include.text', 'code 685')

		cy.contains('Saint-Barthélémy, Saint-Martin').click()

		cy.get('@recapTable').should('include.text', 'code 687')

		cy.contains("Barème d'exonération sectorielle").click()

		cy.get('@recapTable').should('include.text', 'code 686')

		cy.contains("Barème d'exonération renforcée").click()

		cy.get('@recapTable').should('include.text', 'code 688')
	})

	it('should not include regularization for zone 2', function () {
		cy.contains('régularisation', { matchCase: false }).should('not.exist')
	})

	it('should be RGAA compliant', function () {
		cy.contains('Exonération mensuelle').click()
		checkA11Y()
		cy.contains('Exonération annuelle').click()
		checkA11Y()
		cy.contains('Exonération mois par mois').click()
		checkA11Y()
	})
})
