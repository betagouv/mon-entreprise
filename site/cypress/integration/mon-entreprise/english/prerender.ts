import { fr } from '../../../support/utils'

type cyType = typeof cy
type Obj = Record<string, { test: (cy: cyType) => unknown; path: string }[]>

const coutTotalSelector = 'input[id="salariécoûttotalemployeur"]'
const salaireBrutSelector = 'input[id="salariécontratsalairebrut"]'
const salaireNetSelector = 'input[id="salariérémunérationnetàpayeravantimpôt"]'
const salaireNetApresImpot = 'input[id="salariérémunérationnetpayéaprèsimpôt"]'

describe('Test prerender', function () {
	const testSimuSalaire = (cy: cyType) => {
		cy.contains('Mensuel')
		cy.contains('Annuel')

		cy.contains('Coût total')
		cy.get(coutTotalSelector).should('exist')

		cy.contains('Salaire brut')
		cy.get(salaireBrutSelector).should('exist')

		cy.contains('salaire médian')
		cy.contains('SMIC')

		cy.contains('Salaire net')
		cy.get(salaireNetSelector).should('exist')

		cy.contains('Salaire net après impôt')
		cy.get(salaireNetApresImpot).should('exist')
	}

	const testSimuSalary = () => {
		cy.contains('Total employer cost')
		cy.get(coutTotalSelector).should('exist')

		cy.contains('Gross salary')
		cy.get(salaireBrutSelector).should('exist')

		cy.contains('median wage')
		cy.contains('SMIC')

		cy.contains('Net salary')
		cy.get(salaireNetSelector).should('exist')

		cy.contains('Net salary after income tax')
		cy.get(salaireNetApresImpot).should('exist')
	}

	const tests = {
		'mon-entreprise': [
			{
				test: testSimuSalaire,
				path: '/simulateurs/salaire-brut-net',
			},
			{
				test: (cy) => {
					cy.contains('Impôt sur le revenu')
					cy.contains('Impôt sur les sociétés')

					cy.contains('Mensuel')
					cy.contains('Annuel')

					cy.contains("Chiffre d'affaires")
					cy.get('input[id="entreprisechiffred\'affaires"]').should('exist')

					cy.contains('Charges')
					cy.get('input[id="entreprisecharges"]').should('exist')

					cy.get('input[id="dirigeantrémunérationnet"]').should('exist')

					cy.contains('Revenu après impôt')
					cy.get('input[id="dirigeantrémunérationnetaprèsimpôt"]').should(
						'exist'
					)
				},
				path: '/simulateurs/indépendant',
			},
			{
				test: testSimuSalaire,
				path: '/iframes/simulateur-embauche',
			},
		],
		infrance: [
			{
				path: '',
				test: () => {
					cy.contains('The official tools for entrepreneurs')

					cy.contains('Search for your company')
					cy.contains('label', 'Company name, SIREN or SI')

					cy.contains("I don't have a business yet")

					cy.contains('a', 'Employee')
					cy.contains('a', 'Auto-entrepreneur')
					cy.contains('a', 'Liberal profession')
					cy.contains('a', 'Discover all the simulators and assistants')
				},
			},
			{
				path: '/calculators/salary',
				test: testSimuSalary,
			},
			{
				path: '/iframes/simulateur-embauche',
				test: testSimuSalary,
			},
		],
	} as Obj

	tests[fr ? 'mon-entreprise' : 'infrance'].forEach(({ path, test }) => {
		it(`should show the pre-render of ${fr ? 'fr' : 'en'} ${
			path || '/'
		}`, function () {
			cy.visit(path || '/', { script: false })
				.get('#loading', { timeout: 200 })
				.should('not.exist')

			test(cy)
		})
	})
})
