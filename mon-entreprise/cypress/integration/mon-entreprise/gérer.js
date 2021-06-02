const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const GERER_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/gérer`
const writeFixtures = Cypress.env('record_http') !== undefined
const stubFixtures = !writeFixtures
const setInterceptResponses = (requestsMatches, responses, ...urlsMatch) => {
	// TODO: just capture everything by default?
	if (writeFixtures) {
		urlsMatch.forEach((urlMatch) => {
			cy.intercept(urlMatch, (req) => {
				requestsMatches.push(urlMatch)
				req.on('after:response', (res) => {
					responses[res.url] = res.body
				})
			}).as(urlMatch)
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
const waitResponses = (requestsMatches, responses) => {
	if (writeFixtures) {
		if (!requestsMatches.length) return
		// TODO: we pobably don't need to `cy.wait`.
		// Caveat: for a given urlMatch, when any of the matching responses is
		// received (the first one), the `cy.wait` will resolve.
		// see https://docs.cypress.io/api/commands/intercept#Waiting-on-a-request
		cy.wait(requestsMatches.map((urlMatch) => `@${urlMatch}`)).then(() => {
			Object.keys(responses).map((url) => {
				cy.writeFile(
					`${GERER_FIXTURES_FOLDER}/${btoa(url)}.json`,
					JSON.stringify(responses[url], null, 2)
				)
			})
		})
	}
}

describe('Manage page test', function () {
	let requestsMatches = []
	let responses = {}
	const urlsMatch = [
		'https://entreprise.data.gouv.fr/api/sirene/v1/full_text/**',
		'https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/**',
		'https://geo.api.gouv.fr/communes/**',
	]
	beforeEach(() => {
		requestsMatches = []
		responses = {}
		setInterceptResponses(requestsMatches, responses, ...urlsMatch)
		cy.visit(fr ? encodeURI('/gérer') : '/manage')
	})
	afterEach(() => {
		waitResponses(requestsMatches, responses)
	})
	it('should not crash', function () {
		cy.contains(fr ? 'Gérer mon activité' : 'Manage my business')
	})
	it('should allow to retrieve company and show link corresponding to the legal status', function () {
		cy.get('button.cta').click()
		cy.get('input').first().type('menoz')
		cy.contains('834364291').click()
		cy.contains(fr ? 'simulateur SASU' : 'simulator for SASU').click()
		cy.location().should((loc) => {
			expect(loc.pathname).to.match(fr ? /dirigeant-sasu$/ : /sasu-chairman$/)
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
