const fr = Cypress.env('language') === 'fr'

const writeFixtures = Cypress.env('record_http') !== undefined

describe('General navigation', function () {
	it('should enable switching site language', function () {
		cy.visit(
			fr
				? encodeURI('/assistants/choix-du-statut')
				: '/assistants/choice-of-status'
		)
		cy.get(
			fr ? '[data-test-id=en-switch-button]' : '[data-test-id=fr-switch-button]'
		).click()
		cy.url().should(
			'include',
			fr
				? '/assistants/choice-of-status'
				: encodeURI('/assistants/choix-du-statut')
		)
	})

	it('should go back to home when clicking on logo', function () {
		cy.visit(encodeURI('/documentation/contrat-salarié'))
		cy.get('[data-test-id="logo img"]').click()
		cy.url().should('match', new RegExp(`${Cypress.config().baseUrl}/?`))
	})
})

describe(`Navigation to income simulator using company name (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	const FIXTURES_FOLDER = 'cypress/fixtures'
	const GERER_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/gérer`

	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = [
		'recherche-entreprises.api.gouv.fr',
		'api.recherche-entreprises.fabrique.social.gouv.fr',
		'geo.api.gouv.fr',
	]

	beforeEach(function () {
		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			GERER_FIXTURES_FOLDER
		)
		cy.clearLocalStorage() // Try to avoid flaky tests
		cy.visit('/')
	})

	afterEach(function () {
		cy.writeInterceptResponses(
			pendingRequests,
			responses,
			GERER_FIXTURES_FOLDER
		)
	})

	it('should allow to retrieve company and show link corresponding to the legal status', function () {
		cy.intercept({
			method: 'GET',
			hostname: 'recherche-entreprises.api.gouv.fr',
			url: '/search?q=*',
		}).as('search')

		cy.get('input[data-test-id="company-search-input"]').first().type('menoz')
		cy.wait('@search')

		cy.contains('834364291')
			.should('be.visible')
			.parentsUntil('li')
			.find('button')
			.click()

		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/834364291$/)
		})

		cy.contains(fr ? 'Lancer le simulateur' : 'Launch simulator')

		cy.contains('SAS(U)').siblings('a').click()

		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/sasu$/)
		})
	})

	it('should allow auto entrepreneur to access the corresponding income simulator', function () {
		cy.intercept({
			method: 'GET',
			hostname: 'recherche-entreprises.api.gouv.fr',
			url: '/search?q=*',
		}).as('search')

		cy.get('input[data-test-id="company-search-input"]').type('jeremy rialland')
		cy.wait('@search')

		cy.contains('850556812')
			.should('be.visible')
			.parentsUntil('li')
			.find('button')
			.click()

		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/850556812$/)
		})
		cy.contains('Simulateurs pour votre entreprise')

		// ask if auto-entrepreneur
		cy.contains(fr ? 'auto-entrepreneur' : 'auto-entrepreneur')
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(fr ? 'Lancer le simulateur' : 'Launch simulator').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
})
