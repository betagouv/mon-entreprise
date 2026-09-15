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
import 'cypress-wait-until'

Cypress.Commands.add('iframe', { prevSubject: ['element'] }, ($iframe) => {
	// eslint-disable-next-line
	return new Cypress.Promise((resolve) => {
		// eslint-disable-next-line
		setTimeout(() => resolve($iframe.contents().find('body')), 6000)
	})
})

// Short, filesystem-safe, deterministic fixture filename for a recorded URL.
//
// Fixtures used to be named `${btoa(url)}.json`: the full URL, base64-encoded,
// used directly as both the filename and (decoded back) as the intercept
// pattern. This broke `git clone` on Windows in two ways:
// - `btoa`'s standard alphabet includes `/`, which is a path separator on
//   every filesystem: an encoded URL that happens to contain one doesn't
//   produce a single long filename, it silently produces extra, garbage
//   nested directories that then confuse git and Windows' path handling.
// - independently, some of our recorded hostnames are 70+ characters long on
//   their own; combined with a long query string and a typical Windows
//   checkout path, the full encoded URL routinely exceeded Windows' MAX_PATH.
//
// Hashing keeps the filename short (fixed-length) and made only of safe
// characters regardless of URL length. Since a hash can't be decoded back
// into the URL it came from, the original URL is stored inside the fixture
// file itself instead of in its name (see writeInterceptResponses /
// setInterceptResponses below).
const fixtureFilename = (url: string) => {
	// FNV-1a 32-bit: simple, deterministic, plenty collision-resistant for
	// the few dozen URLs recorded per spec (this has no security purpose).
	let hash = 0x811c9dc5

	for (let i = 0; i < url.length; i++) {
		hash ^= url.charCodeAt(i)
		hash = Math.imul(hash, 0x01000193)
	}
	return (hash >>> 0).toString(16).padStart(8, '0')
}

type RecordedFixture = { url: string; body: unknown }

Cypress.Commands.add(
	'setInterceptResponses',
	(pendingRequests, responses, hostnames, specFixturesFolder) => {
		const writeFixtures = Cypress.env('record_http') !== undefined
		const stubFixtures = !writeFixtures

		if (writeFixtures) {
			cy.intercept('*', (req) => {
				if (!hostnames.includes(new URL(req.url).hostname)) return
				pendingRequests.add(req.url)
				req.on('after:response', (res) => {
					pendingRequests.delete(req.url)
					// @ts-ignore
					// eslint-disable-next-line
					responses[res.url] = res.body
				})
			})
		} else if (stubFixtures) {
			cy.exec(`find ${specFixturesFolder} -type f`)
				.then((result) => {
					return result.stdout.split('\n').filter(Boolean)
				})
				.then((filepaths) => {
					filepaths.forEach((filepath) => {
						cy.readFile(filepath).then(
							(fixture: RecordedFixture) => {
								cy.intercept(encodeURI(fixture.url), {
									body: fixture.body,
								})
							}
						)
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

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			cy.waitUntil(() => pendingRequests.size === 0)
			Object.keys(responses).forEach((url) => {
				if (responses[url] === undefined) return undefined
				const fixture: RecordedFixture = { url, body: responses[url] }
				cy.writeFile(
					`${specFixturesFolder}/${fixtureFilename(url)}.json`,
					JSON.stringify(fixture, null, 2)
				)
			})
		}
	}
)

/**
 * Add option to disable javascript with { script: false }
 */
Cypress.Commands.overwrite('visit', (orig, url, options = {}) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	const window = cy.state('window') as Cypress.AUTWindow
	const parentDocument = window.parent.document
	const iframe = parentDocument.querySelector('main iframe')

	if (!iframe) {
		// @ts-ignore
		return orig(url, options)
	}

	if (options.script === false) {
		if (Cypress.config('chromeWebSecurity') !== false) {
			throw new TypeError(
				"When you disable script you also have to set 'chromeWebSecurity' in your config to 'false'"
			)
		}
		// @ts-ignore
		iframe.sandbox = ''
	} else {
		// In case it was added by a visit before, the attribute has to be removed from the iframe
		iframe.removeAttribute('sandbox')
	}

	// @ts-ignore
	return orig(url, options)
})

// Types

/// <reference types="cypress" />
declare global {
	/* eslint-disable no-unused-vars */
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			/**
			 * @param pendingRequests
			 * @param responses
			 * @param hostnames
			 * @param specFixturesFolder
			 */
			setInterceptResponses(
				pendingRequests: Set<unknown>,
				responses: Record<string, unknown>,
				hostnames: string[],
				specFixturesFolder: string
			): Chainable<Element>

			/**
			 * @param pendingRequests
			 * @param responses
			 * @param specFixturesFolder
			 */
			writeInterceptResponses(
				pendingRequests: Set<unknown>,
				responses: Record<string, unknown>,
				specFixturesFolder: string
			): Chainable<Element>

			/**
			 */
			iframe(): Chainable<Element>

			visit(
				url: string,
				options?: Partial<Cypress.VisitOptions> & { script?: boolean }
			): Chainable<Cypress.AUTWindow>
			visit(
				options: Partial<Cypress.VisitOptions> & {
					url: string
					script?: boolean
				}
			): Chainable<Cypress.AUTWindow>
		}
	}
	/* eslint-enable no-unused-vars */
}
