const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const GERER_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/gérer`
const writeFixtures = Cypress.env('record_http') !== undefined
const stubFixtures = !writeFixtures
const setInterceptResponses = (responses, hostnames) => {
	if (writeFixtures) {
		cy.intercept('*', (req) => {
			if (!hostnames.includes(new URL(req.url).hostname)) return
			req.on('after:response', (res) => {
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
const waitResponses = (responses) => {
	if (writeFixtures) {
		// No need to `cy.wait`, we anyway don't care about not-yet-received
		// responses, as we don't care about responses not yet utilized in the
		// test itself. Caveat: fixtures folder is undeterministic when recording.
		Object.keys(responses).map((url) => {
			if (responses[url] === undefined) return
			cy.writeFile(
				`${GERER_FIXTURES_FOLDER}/${btoa(url)}.json`,
				JSON.stringify(responses[url], null, 2)
			)
		})
	}
}

describe('Manage page test', function () {
	let responses = {}
	const hostnamesToRecord = ['entreprise.data.gouv.fr', 'geo.api.gouv.fr']
	beforeEach(() => {
		responses = {}
		setInterceptResponses(responses, hostnamesToRecord)
		cy.visit(fr ? encodeURI('/gérer') : '/manage')
	})
	afterEach(() => {
		waitResponses(responses)
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
