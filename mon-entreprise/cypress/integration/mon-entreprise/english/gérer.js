const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const GERER_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/gérer`

const writeFixtures = Cypress.env('record_http') !== undefined

describe(`Manage page test (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = ['entreprise.data.gouv.fr', 'geo.api.gouv.fr']
	beforeEach(() => {
		cy.clearLocalStorage() // Try to avoid flaky tests

		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			GERER_FIXTURES_FOLDER
		)
		cy.visit(fr ? encodeURI('/gérer') : '/manage')
	})
	afterEach(() => {
		cy.writeInterceptResponses(
			pendingRequests,
			responses,
			GERER_FIXTURES_FOLDER
		)
	})
	it('should not crash', function () {
		cy.contains(fr ? 'Gérer mon activité' : 'Manage my business')
	})
	it('should allow to retrieve company and show link corresponding to the legal status', function () {
		cy.contains(fr ? 'Renseigner mon entreprise' : 'Find my company').click()
		cy.get('input').first().type('menoz')
		cy.contains('834364291').click()
		cy.contains(
			fr ? 'Calculer mon revenu net' : 'Calculate my net income'
		).click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/sasu$/)
		})
	})
	it('should allow auto entrepreneur to access the corresponding income simulator', function () {
		cy.contains(fr ? 'Renseigner mon entreprise' : 'Find my company').click()

		cy.get('input').first().type('johan girod')
		cy.contains('MONSIEUR').click()
		// ask if auto-entrepreneur
		cy.contains(
			fr ? 'Êtes-vous auto-entrepreneur ?' : 'Are you an auto-entrepreneur?'
		)
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(
			fr ? 'simulateur auto-entrepreneur' : 'simulator of the URSSAF'
		).click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
})
