const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const GERER_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/gérer`
const writeFixtures = Cypress.env('record_http') !== undefined
const stubFixtures = !writeFixtures
const setInterceptResponses = (pendingRequests, responses, hostnames) => {
	if (writeFixtures) {
		cy.intercept('*', (req) => {
			if (!hostnames.includes(new URL(req.url).hostname)) return
			pendingRequests.add(req.url)
			req.on('after:response', (res) => {
				pendingRequests.delete(req.url)
				responses[res.url] = res.body
			})
		})
	} else if (stubFixtures) {
		const urlOfFilepath = (filename) => {
			return atob(filename.slice(0, -'.json'.length))
		}
		cy.exec(`find ${GERER_FIXTURES_FOLDER} -type f`)
			.then((result) => {
				return result.stdout.split('\n')
			})
			.then((filepaths) => {
				filepaths.forEach((filepath) => {
					const shortPath = filepath.slice(FIXTURES_FOLDER.length + 1)
					const filename = filepath.slice(GERER_FIXTURES_FOLDER.length + 1)
					cy.intercept(urlOfFilepath(filename), { fixture: shortPath })
				})
			})
	}
}
const writeResponses = (pendingRequests, responses) => {
	if (writeFixtures) {
		// We need to wait on all catched requests to be fulfilled and recorded,
		// otherwise the stubbed cy run might error when a request is not stubbed.
		// Caveat: we assume request.url to be unique amongst recorded requests.
		cy.waitUntil(() => pendingRequests.size === 0)
		Object.keys(responses).map((url) => {
			if (responses[url] === undefined) return
			cy.writeFile(
				`${GERER_FIXTURES_FOLDER}/${btoa(url)}.json`,
				JSON.stringify(responses[url], null, 2)
			)
		})
	}
}

describe(`Manage page test (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = ['entreprise.data.gouv.fr', 'geo.api.gouv.fr']
	beforeEach(() => {
		pendingRequests = new Set()
		responses = {}
		setInterceptResponses(pendingRequests, responses, hostnamesToRecord)
		cy.visit(fr ? encodeURI('/gérer') : '/manage')
	})
	afterEach(() => {
		writeResponses(pendingRequests, responses)
	})
	it('should not crash', function () {
		cy.contains(fr ? 'Gérer mon activité' : 'Manage my business')
	})
	it('should allow to retrieve company and show link corresponding to the legal status', function () {
		cy.get('button.cta').click()
		cy.get('input').first().type('menoz')
		cy.contains('834364291').click()
		cy.contains(
			fr ? 'Calculer mon revenu net de cotisations' : 'Calculate my net income'
		).click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/sasu$/)
		})
	})
	it('should allow auto entrepreneur to access the corresponding income simulator', function () {
		cy.get('button.cta').click()
		cy.get('input').first().type('johan girod')
		cy.contains('MONSIEUR').click()
		// ask if auto-entrepreneur
		cy.contains(
			fr ? 'Êtes-vous auto-entrepreneur ?' : 'Are you auto-entrepreneur?'
		)
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(
			fr ? 'simulateur auto-entrepreneur' : 'simulator for auto-entrepreneur'
		).click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
})
