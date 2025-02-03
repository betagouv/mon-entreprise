import { checkA11Y } from './utils'

const inputSelector =
	'div[id="simulator-legend"] input[inputmode="numeric"]:not([id="entreprise___charges"])'
const chargeInputSelector = 'input[id="entreprise___charges"]'
const lang = Cypress.env('language') as 'fr' | 'en'

type Simulateur =
	| 'auto-entrepreneur'
	| 'salaire-brut-net'
	| 'salary'
	| 'sasu'
	| 'indépendant'
	| 'profession-liberale'
	| 'profession-liberale/auxiliaire-medical'
	| 'profession-liberale/chirurgien-dentiste'
	| 'profession-liberale/médecin'
	| 'profession-liberale/sage-femme'

const variableNames = {
	url: {
		fr: 'simulateurs',
		en: 'calculators',
	},
	yearTab: {
		fr: 'Montant annuel',
		en: 'Annual amount',
	},
	monthTab: {
		fr: 'Montant mensuel',
		en: 'Monthly amount',
	},
	contributions: {
		fr: 'Cotisations',
		en: 'Contributions',
	},
	question: {
		fr: 'Améliorez votre simulation en répondant aux questions',
		en: 'Improve your simulation by answering the questions below',
	},
}

export const runSimulateurTest = (simulateur: Simulateur) => {
	describe(`Simulateur ${simulateur}`, { testIsolation: false }, function () {
		before(function () {
			return cy.visit(encodeURI(`/${variableNames.url[lang]}/${simulateur}`))
		})

		it('should not crash', function () {
			cy.get(inputSelector)
		})

		it('should display questions when entering a value in an input', function () {
			cy.contains(variableNames.question[lang]).should('not.exist')

			cy.get(inputSelector).first().type('{selectall}1000')

			cy.contains(variableNames.question[lang]).should('be.visible')
		})

		it('should display a result when entering a value in any of the currency input', function () {
			cy.contains(variableNames.yearTab[lang]).click()

			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).type('1000')
			}
			cy.get(inputSelector).each(($testedInput) => {
				// eslint-disable-next-line cypress/unsafe-to-chain-command
				cy.wrap($testedInput)
					.type('{selectall}60111')
					.and(($i) =>
						expect(($i.val() as string).replace(/[\s,.€]/g, '')).to.match(
							/[1-9][\d]{3,6}$/
						)
					)
				cy.get(inputSelector).each(($input) => {
					if ($testedInput.get(0) === $input.get(0)) return
					cy.wrap($input).and(($i) => {
						const val = ($i.val() as string).replace(/[\s,.€]/g, '')
						expect(val).not.to.be.eq('60111')
						expect(val).to.match(/[1-9][\d]{3,6}$/)
					})
				})
				cy.contains(variableNames.contributions[lang])
			})
		})

		it('should allow to change period', function () {
			cy.contains(variableNames.yearTab[lang]).click()
			cy.get(inputSelector).first().type('{selectall}12000')
			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).type('{selectall}6000')
			}
			cy.get(inputSelector).eq(1).invoke('val').should('not.be.empty')
			cy.contains(variableNames.monthTab[lang]).click()
			cy.get(inputSelector)
				.first()
				.invoke('val')
				.should('match', /1[\s,]000/)
			if (['indépendant', 'profession-liberale'].includes(simulateur)) {
				cy.get(chargeInputSelector).first().invoke('val').should('match', /500/)
			}
		})

		it('should allow to navigate to a documentation page and back', function () {
			cy.contains(variableNames.yearTab[lang]).click()
			cy.get(inputSelector).first().type('{selectall}2000')
			cy.contains(variableNames.contributions[lang]).click()
			cy.location().should((loc) => {
				expect(loc.pathname).to.match(/\/documentation\/.*\/cotisations.*/)
			})

			cy.contains('← ').click()

			cy.get(inputSelector)
				.first()
				.invoke('val')
				.should('match', /2[\s,]000/)
		})

		it('should be RGAA compliant', function () {
			checkA11Y()
		})
	})
}
