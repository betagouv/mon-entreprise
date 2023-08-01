import { checkA11Y, fr } from '../../../support/utils'

describe(`Assistant choix du statut`, { testIsolation: false }, function () {
	if (!fr) {
		return
	}
	before(function () {
		cy.visit(encodeURI('/'))
		cy.clearAllLocalStorage()
	})

	it('should allow start assistant', function () {
		cy.visit(encodeURI('/'))
		cy.contains("J'aimerais créer mon entreprise").click()
		checkA11Y()
		cy.contains('Trouver le bon statut').click()
	})

	it('should allow to select activity', function () {
		cy.get('input[type=search]').type('coiff')
		cy.contains('Coiffure').click()
		checkA11Y()
		cy.contains('Enregistrer et continuer').click()
		checkA11Y()
		cy.contains('Continuer avec cette activité').click()
	})

	it('should allow to select commune', function () {
		cy.get('input[aria-autocomplete="list"]').type('Saint-Remy-en-B')
		cy.contains('Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson').click()
		cy.contains('Enregistrer et continuer').not('[disabled]').click()
	})

	it('should allow to specify if non profit', function () {
		cy.contains("Dans le but de gagner de l'argent").click()
		checkA11Y()
		cy.contains('Enregistrer et continuer').click()
	})

	it('should allow to specify associates', function () {
		cy.contains('Seul').click()
		cy.contains('Oui').click()
		checkA11Y()
		cy.contains('Enregistrer et continuer').click()
	})

	it('should allow to input remuneration and select appropriate statut', function () {
		cy.get('#CA').click().type('50000')
		cy.get('#charges').click().type('10000')

		checkA11Y()
		cy.contains('Enregistrer et continuer').not('[disabled]').click()
		cy.contains('Choisir ce statut').click()
		cy.contains('Vous avez choisi le statut :')
	})
})
