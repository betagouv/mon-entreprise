import { baseUrl, fr } from '../../../support/utils'

describe('Test sitemap', function () {
	it(`should visit sitemap ${fr ? 'fr' : 'en'}`, function () {
		cy.request(`/sitemap.${fr ? 'fr' : 'en'}.txt`)
			.should('be.ok')
			.then((data) => {
				const lines = (data.body as string)
					.split('\n')
					.filter((x) => x.length > 0)

				if (lines.every((x) => x.startsWith(baseUrl))) {
					return lines
				}

				return []
			})
			.should('have.length.greaterThan', 60)
	})
})
