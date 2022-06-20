import { fr } from '../../../support/utils'

describe('Test prerender', function () {
	const tests = {
		'mon-entreprise': [
			'/simulateurs/salaire-brut-net',
			'/simulateurs/indépendant',
			'/iframes/simulateur-embauche',
		],
		infrance: ['', '/calculators/salary', '/iframes/simulateur-embauche'],
	}

	tests[fr ? 'mon-entreprise' : 'infrance'].forEach((path) => {
		it(`should show the pre-render of ${fr ? 'fr' : 'en'} ${
			path || '/'
		}`, function () {
			cy.visit(path || '/', { script: false })
				.get('#loading', { timeout: 200 })
				.should('not.exist')
		})
	})
})
