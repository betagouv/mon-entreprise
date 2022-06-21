import { fr } from '../../../support/utils'
// @ts-ignore
import prerenderPaths from '../../../prerender-paths.json'

describe('Test prerender', function () {
	const paths = (
		prerenderPaths as { 'mon-entreprise': string[]; infrance: string[] }
	)[fr ? 'mon-entreprise' : 'infrance']

	paths.forEach((path) => {
		it(`should show the pre-render of ${fr ? 'fr' : 'en'} ${
			path || '/'
		}`, function () {
			cy.visit(encodeURI(path || '/'), { script: false })
				.get('#loading', { timeout: 200 })
				.should('not.exist')
		})
	})
})
