import { checkA11Y, fr } from '../../support/utils'

describe(
	'Simulateur réduction générale',
	{ testIsolation: false },
	function () {
		if (!fr) {
			return
		}

		const inputSelector =
			'div[id="simulator-legend"] input[inputmode="numeric"]'

		before(function () {
			return cy.visit('/simulateurs/réduction-générale')
		})

		it('should not crash', function () {
			cy.contains('Salaire brut')
		})

		it('should allow to change time period', function () {
			cy.get(inputSelector).first().type('{selectall}22800')

			cy.contains('Réduction mensuelle').click()
			// Wait for values to update
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(750)
			cy.get(inputSelector).first().should('have.value', '1 900 €')
		})

		it('should display values for the réduction générale', function () {
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale-value"]'
			).should('include.text', '523,26 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_retraite_complémentaire-value"]'
			).should('include.text', '98,46 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_sécurité_sociale-value"]'
			).should('include.text', '424,80 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_chômage-value"]'
			).should('include.text', '66,35 €')
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
				'p[id="salarié___cotisations___exonérations___réduction_générale-value"]'
			).should('include.text', '529,72 €')

			cy.contains('Moins de 50 salariés').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[data-cy="modal"]')
				.eq(0)
				.contains('Effectif')
				.next()
				.contains('10')
			cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()
		})

		it('should allow to select an option for caisse de congés payés', function () {
			cy.get('div[aria-labelledby="caisse-congés-payés-label"]')
				.contains('Oui')
				.click()

			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale-value"]'
			).should('include.text', '581,40 €')

			cy.get('div[aria-labelledby="caisse-congés-payés-label"]')
				.contains('Non')
				.click()
		})

		it('should display a warning for a remuneration too high', function () {
			cy.get(inputSelector).first().type('{selectall}3000')

			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.'
			)

			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale-value"]'
			).should('have.text', '0 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_retraite_complémentaire-value"]'
			).should('have.text', '0 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_sécurité_sociale-value"]'
			).should('have.text', '0 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_chômage-value"]'
			).should('have.text', '0 €')
		})

		it('should display remuneration and RGCP month by month', function () {
			cy.contains('Réduction annuelle').click()
			cy.get(inputSelector).first().type('{selectall}22800')

			cy.contains('Réduction mois par mois').click()
			cy.contains('Réduction générale mois par mois :')
			// Wait for values to update
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(1)
			cy.get(inputSelector)
				.should('have.length', 12)
				.each(($input) => {
					cy.wrap($input).should('have.value', '1 900 €')
				})
			cy.get(
				'[id^="salarié___cotisations___exonérations___réduction_générale-"]'
			)
				.should('have.length', 12)
				.each(($input, $index) => {
					if ($index < 10) {
						cy.wrap($input).should('include.text', '493,43 €')
					}
				})
		})

		it('should calculate RGCP month by month independently', function () {
			cy.get(inputSelector).eq(1).type('{selectall}2000')

			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-janvier'
			).should('include.text', '493,43 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-février'
			).should('include.text', '440,23 €')
		})

		it('should save remuneration between tabs', function () {
			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().should('have.value', '1 908,33 €')
			cy.contains('Réduction annuelle').click()
			cy.get(inputSelector).first().should('have.value', '22 900 €')
			cy.contains('Réduction mois par mois').click()
			cy.get(inputSelector).each(($input, index) => {
				let expectedValue = '1 900 €'
				if (index === 1) {
					expectedValue = '2 000 €'
				}
				cy.wrap($input).should('have.value', expectedValue)
			})
		})

		it('should include progressive regularisation', function () {
			cy.get(inputSelector).eq(1).type('{selectall}3000')

			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-février'
			).should('include.text', '0 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale__régularisation-février'
			).should('include.text', '-92,12 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-mars'
			).should('include.text', '493,57 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-décembre'
			).should('include.text', '523,62 €')
		})

		it('should include annual regularisation', function () {
			cy.contains('Régularisation annuelle').click()

			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-février'
			).should('include.text', '0 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale__régularisation-février'
			).should('not.exist')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-mars'
			).should('include.text', '493,43 €')
			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-décembre'
			).should('include.text', '432,49 €')
		})

		it('should include monthly options', function () {
			cy.get(inputSelector).first().type('{selectall}2100')
			cy.get(
				'div[id="simulator-legend"] button[aria-describedby="options-description"]'
			)
				.should('have.length', 12)
				.first()
				.click()
			cy.get('input[id="option-heures-sup-janvier"]')
				.should('be.visible')
				.type('{selectall}28,15')

			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-janvier'
			).should('include.text', '666,33 €')
		})

		it('should handle incomplete months', function () {
			cy.get(inputSelector).first().type('{selectall}1500')
			cy.get('input[id="option-heures-sup-janvier"]').type('{selectall}5')
			cy.get(
				'div[id="simulator-legend"] p[aria-describedby="options-mois-incomplet-description"]'
			)
				.should('be.visible')
				.click()
			cy.get('input[id="option-rémunération-etp-janvier"]')
				.should('be.visible')
				.type('{selectall}1900')
			cy.get('input[id="option-rémunération-primes-janvier"]')
				.should('be.visible')
				.type('{selectall}200')
			cy.get('input[id="option-rémunération-heures-sup-janvier"]')
				.should('be.visible')
				.type('{selectall}100')

			cy.get(
				'#salarié___cotisations___exonérations___réduction_générale-janvier'
			).should('include.text', '479,10 €')

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
			// Wait for values to update
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(500)
			cy.get('#recap-1er_trimestre-671').should('include.text', '602,88 €')
			cy.get('#recap-2ème_trimestre-801').should('include.text', '-276,40 €')
			cy.get('#recap-3ème_trimestre-671').should('include.text', '1 481,79 €')
			cy.get('#recap-4ème_trimestre-671').should('include.text', '1 539,05 €')
		})

		it('should be RGAA compliant', function () {
			cy.contains('Réduction mensuelle').click()
			checkA11Y()
			cy.contains('Réduction annuelle').click()
			checkA11Y()
			cy.contains('Réduction mois par mois').click()
			checkA11Y()
		})
	}
)
