// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe) => {
	return new Cypress.Promise((resolve) => {
		setTimeout(() => resolve($iframe.contents().find('body')), 6000)
	})
})
import 'cypress-wait-until'
Cypress.Commands.add(
	'setInterceptResponses',
	(pendingRequests, responses, hostnames, specFixturesFolder) => {
		const FIXTURES_FOLDER = 'cypress/fixtures'

		const writeFixtures = Cypress.env('record_http') !== undefined
		const stubFixtures = !writeFixtures

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
			cy.exec(`find ${specFixturesFolder} -type f`)
				.then((result) => {
					return result.stdout.split('\n')
				})
				.then((filepaths) => {
					filepaths.forEach((filepath) => {
						const shortPath = filepath.slice(FIXTURES_FOLDER.length + 1)
						const filename = filepath.slice(specFixturesFolder.length + 1)
						cy.intercept(urlOfFilepath(filename), { fixture: shortPath })
					})
				})
		}
	}
)
Cypress.Commands.add(
	'writeInterceptResponses',
	(pendingRequests, responses, specFixturesFolder) => {
		const writeFixtures = Cypress.env('record_http') !== undefined

		if (writeFixtures) {
			// We need to wait on all catched requests to be fulfilled and recorded,
			// otherwise the stubbed cy run might error when a request is not stubbed.
			// Caveat: we assume request.url to be unique amongst recorded requests.
			cy.waitUntil(() => pendingRequests.size === 0)
			Object.keys(responses).map((url) => {
				if (responses[url] === undefined) return
				cy.writeFile(
					`${specFixturesFolder}/${btoa(url)}.json`,
					JSON.stringify(responses[url], null, 2)
				)
			})
		}
	}
)
