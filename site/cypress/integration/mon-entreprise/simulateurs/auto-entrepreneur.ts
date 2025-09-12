import { checkA11Y, fr, getAmountFromText } from '../../../support/utils'

describe('Simulateur auto-entrepreneur', function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	beforeEach(function () {
		cy.visit('/simulateurs/auto-entrepreneur')
	})

	it('devrait afficher un raccourci vers l’Acre lorsque la date de création est inférieure à 1 an', function () {
		cy.contains('Montant annuel').click()
		cy.get(inputSelector).first().type('{selectall}50000')
		cy.contains('Modifier mes réponses').click()
		cy.get('div[data-cy="modal"]')
			.first()
			.contains('Date de création')
			.next()
			.find('button')
			.click()
		const year = new Date().getFullYear()
		cy.get('input[aria-label="Champ de date au format jours/mois/année"]').type(
			`{selectall}01/01/${year}`
		)
		cy.get('div[data-cy="modal"]').contains('Fermer').click()

		cy.contains('ACRE')
	})

	it('ne devrait pas avoir de valeurs négatives', function () {
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

	it('devrait afficher un bouton "Activité mixte" qui ajoute 3 champs de chiffre d’affaires', function () {
		cy.get(inputSelector)
			.its('length')
			.then((length) => {
				cy.contains('Activité mixte').click()

				cy.get(inputSelector).should('have.length', length + 3)
			})
	})

	it('devrait modifier le chiffre d’affaires total lorsque le second champ de CA d’activité mixte est modifié', function () {
		cy.contains('Montant mensuel').click()
		cy.get(inputSelector).first().type('{selectall}5000')
		cy.contains('Activité mixte').click()
		cy.get(inputSelector).eq(2).type('{selectall}5000')

		cy.get(inputSelector).first().should('have.value', '10 000 €')
	})

	it('devrait conserver les proportions de chiffre d’affaires mixte lorsque le CA total est modifié', function () {
		cy.contains('Montant mensuel').click()
		cy.contains('Activité mixte').click()
		cy.get(inputSelector).eq(1).type('{selectall}2500')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.get(inputSelector).eq(2).type('{selectall}5000')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.get(inputSelector).eq(3).type('{selectall}2500')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.get(inputSelector).first().type('{selectall}5000')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.get(inputSelector)
			.eq(1)
			.invoke('val')
			.should(($value) => expect($value).to.be.equal('1 250 €'))
		cy.get(inputSelector)
			.eq(2)
			.invoke('val')
			.should(($value) => expect($value).to.be.equal('2 500 €'))
		cy.get(inputSelector)
			.eq(3)
			.invoke('val')
			.should(($value) => expect($value).to.be.equal('1 250 €'))
	})

	it('devrait conserver les proportions de chiffre d’affaires mixte lorsque le revenu net après impôt est modifié', function () {
		cy.contains('Montant mensuel').click()
		cy.get(inputSelector).first().type('{selectall}2500')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.contains('Activité mixte').click()
		cy.get(inputSelector).eq(2).type('{selectall}2500')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		cy.get(inputSelector).last().type('{selectall}2500')

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(3000)

		let CA1: number
		cy.get(inputSelector)
			.eq(1)
			.invoke('val')
			.should(($value) => {
				CA1 = getAmountFromText($value as string)
				expect(CA1).to.be.lessThan(1250)
			})
		cy.get(inputSelector)
			.eq(2)
			.invoke('val')
			.should(($value) => {
				const CA2 = getAmountFromText($value as string)
				expect(CA2).to.be.equal(2 * CA1)
			})
		cy.get(inputSelector)
			.eq(3)
			.invoke('val')
			.should(($value) => {
				const CA3 = getAmountFromText($value as string)
				expect(CA3).to.be.equal(CA1)
			})
	})

	it('devrait afficher des taux d’imposition et de cotisations à 0 lorsque le chiffre d’affaires vaut 0', function () {
		cy.get(inputSelector).first().type('{selectall}0')

		cy.contains('Cotisations 0 %')
		cy.contains('Impôt 0 %')
	})

	it('devrait respecter le RGAA', function () {
		checkA11Y()
	})
})
