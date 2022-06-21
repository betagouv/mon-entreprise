import { fr } from '../../../support/utils'

describe('Test sitemap', function () {
	it(`should visit sitemap ${fr ? 'fr' : 'en'}`, function () {
		cy.request(`/sitemap.${fr ? 'fr' : 'en'}.txt`).should('be.ok')
	})
})
