import { checkA11Y, fr } from '../../../support/utils'

describe('Simulateur auto-entrepreneur', function () {
	if (!fr) {
		return
	}

	const inputSelector = 'div[id="simulator-legend"] input[inputmode="numeric"]'

	beforeEach(function () {
		cy.visit('/simulateurs/auto-entrepreneur')
	})

	it('devrait afficher un raccourci vers l’Acre lorsque la date de création est inférieure à 1 an', function () {
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

	const parseActivitéMixtes = (elems: HTMLInputElement[]) =>
		elems
			.slice(1, 4)
			.map((elem) => parseInt(elem.value.replace(/[\s,.€]/g, '')))

	it('devrait conserver les proportions de chiffre d’affaires mixte lorsque le CA total est modifié', function () {
		cy.contains('Montant mensuel').click()
		cy.contains('Activité mixte').click()
		cy.get(inputSelector).eq(1).type('{selectall}2500')
		cy.get(inputSelector).eq(2).type('{selectall}5000')
		cy.get(inputSelector).eq(3).type('{selectall}2500')
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(500)
		cy.get(inputSelector).first().type('{selectall}5000')

		cy.get<HTMLInputElement>(inputSelector).should(($elem) => {
			const activitéMixtes = parseActivitéMixtes($elem.toArray())

			expect(activitéMixtes).to.deep.equal([1250, 2500, 1250])
		})
	})

	it('devrait conserver les proportions de chiffre d’affaires mixte lorsque le revenu net après impôt est modifié', function () {
		cy.contains('Montant mensuel').click()
		cy.get(inputSelector).first().type('{selectall}2500')
		cy.contains('Activité mixte').click()
		cy.get(inputSelector).eq(2).type('{selectall}2500')
		cy.get(inputSelector).last().type('{selectall}2500')

		cy.get<HTMLInputElement>(inputSelector).should(($elem) => {
			const activitéMixtes = parseActivitéMixtes($elem.toArray())

			expect(activitéMixtes[0]).to.be.equal(activitéMixtes[2])
			expect(activitéMixtes[1]).to.be.equal(activitéMixtes[0] * 2)
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
