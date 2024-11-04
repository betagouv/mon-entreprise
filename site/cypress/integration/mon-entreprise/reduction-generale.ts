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

		it('should allow to select a company size', function () {
			cy.get(inputSelector).first().type('{selectall}2000')

			cy.contains('Plus de 50 salariés').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[data-cy="modal"]')
				.eq(0)
				.contains('Effectif')
				.next()
				.contains('100')
			cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()

			cy.contains('Moins de 50 salariés').click()
			cy.contains('Modifier mes réponses').click()
			cy.get('div[data-cy="modal"]')
				.eq(0)
				.contains('Effectif')
				.next()
				.contains('10')
			cy.get('div[data-cy="modal"]').eq(0).contains('Fermer').click()
		})

		it('should allow to change time period', function () {
			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().type('{selectall}2000')

			cy.contains('Réduction annuelle').click()
			cy.get(inputSelector).first().should('have.value', '24 000 €')
		})

		it('should display values for the réduction générale', function () {
			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().type('{selectall}1900')

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

		it('should display a warning for a remuneration too high', function () {
			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().type('{selectall}3000')

			cy.get('div[id="simulator-legend"]').should(
				'include.text',
				'La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.'
			)

			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_retraite_complémentaire-value"]'
			).should('include.text', '0 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_sécurité_sociale-value"]'
			).should('include.text', '0 €')
			cy.get(
				'p[id="salarié___cotisations___exonérations___réduction_générale___imputation_chômage-value"]'
			).should('include.text', '0 €')
		})

		it('should display remuneration and RGCP month by month', function () {
			cy.contains('Réduction annuelle').click()
			cy.get(inputSelector).first().type('{selectall}30000')

			cy.contains('Réduction mois par mois').click()
			cy.contains('Réduction générale mois par mois :')
			cy.get(inputSelector)
				.should('have.length', 12)
				.each(($input) => {
					cy.wrap($input).should('have.value', '2 500 €')
				})
			cy.get(
				'td[id^="salarié___cotisations___exonérations___réduction_générale-"]'
			)
				.should('have.length', 12)
				.each(($td) => {
					cy.wrap($td).should('include.text', '203,75 €')
				})
		})

		it('should calculate RGCP month by month independently', function () {
			cy.contains('Moins de 50 salariés').click()
			cy.contains('Réduction mois par mois').click()

			cy.get(inputSelector).first().type('{selectall}1900')
			cy.get(inputSelector).last().type('{selectall}2000')
			cy.get(
				'td[id="salarié___cotisations___exonérations___réduction_générale-janvier"]'
			).should('include.text', '523,26 €')
			cy.get(
				'td[id="salarié___cotisations___exonérations___réduction_générale-décembre"]'
			).should('include.text', '470 €')
		})

		it('should save remuneration between tabs', function () {
			cy.contains('Moins de 50 salariés').click()
			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().type('{selectall}1900')
			cy.contains('Réduction mois par mois').click()
			cy.get(inputSelector).first().type('{selectall}2000')
			cy.get(inputSelector).last().type('{selectall}2000')

			cy.contains('Réduction mensuelle').click()
			cy.get(inputSelector).first().should('have.value', '1 916,67 €')
			cy.contains('Réduction annuelle').click()
			cy.get(inputSelector).first().should('have.value', '23 000 €')
			cy.contains('Réduction mois par mois').click()
			cy.get(inputSelector).each(($input, index) => {
				let expectedValue = '1 900 €'
				if (index === 0 || index === 11) {
					expectedValue = '2 000 €'
				}
				cy.wrap($input).should('have.value', expectedValue)
			})
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
