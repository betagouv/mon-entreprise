const fr = Cypress.env('language') === 'fr'

const writeFixtures = Cypress.env('record_http') !== undefined

describe('General navigation', function () {
	it('should enable switching site language', function () {
		cy.visit(
			fr
				? encodeURI('/assistants/choix-du-statut/auto-entrepreneur')
				: '/assistants/choice-of-status/auto-entrepreneur'
		)
		cy.get(
			fr ? '[data-test-id=en-switch-button]' : '[data-test-id=fr-switch-button]'
		).click()
		cy.url().should(
			'include',
			fr
				? '/assistants/choice-of-status/auto-entrepreneur'
				: encodeURI('/assistants/choix-du-statut/auto-entrepreneur')
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
			hostname: 'api.recherche-entreprises.fabrique.social.gouv.fr',
			url: '/api/v1/search*',
		}).as('search')

		cy.contains(
			fr ? 'Rechercher votre entreprise ' : 'Search for your company '
		).click()

		cy.get('input[data-test-id="company-search-input"]')
			.first()
			.type('menoz')
			.wait('@search')

		cy.contains('834364291')
			.should('be.visible')
			.parentsUntil('li')
			.find('button')
			.click()
		cy.contains(fr ? 'Lancer le simulateur' : 'Launch the simulator').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/sasu$/)
		})
	})

	it('should allow auto entrepreneur to access the corresponding income simulator', function () {
		cy.intercept({
			method: 'GET',
			hostname: 'api.recherche-entreprises.fabrique.social.gouv.fr',
			url: '/api/v1/search*',
		}).as('search')

		cy.contains(
			fr ? 'Rechercher votre entreprise ' : 'Search for your company '
		).click()

		cy.get('input[data-test-id="company-search-input"]')
			.type('johan girod')
			.wait('@search')

		cy.contains('834825614')
			.should('be.visible')
			.parentsUntil('li')
			.find('button')
			.click()
		// ask if auto-entrepreneur
		cy.contains(fr ? 'auto-entrepreneur' : 'auto-entrepreneur')
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(fr ? 'Lancer le simulateur' : 'Launch the simulator').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
})
