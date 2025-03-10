import { checkA11Y } from './utils'

const inputSelector =
	'div[id="simulator-legend"] input[inputmode="numeric"]:not([id="entreprise___charges"])'
const chargeInputSelector = 'input[id="entreprise___charges"]'
const lang = Cypress.env('language') as 'fr' | 'en'

type Simulateur =
	| 'auto-entrepreneur'
	| 'eirl'
	| 'eurl'
	| 'entreprise-individuelle'
	| 'salaire-brut-net'
	| 'salary'
	| 'sasu'
	| 'indépendant'
	| 'profession-liberale'
	| 'profession-liberale/auxiliaire-medical'
	| 'profession-liberale/chirurgien-dentiste'
	| 'profession-liberale/médecin'
	| 'profession-liberale/sage-femme'
	| 'profession-liberale/pharmacien'
	| 'profession-liberale/avocat'
	| 'profession-liberale/expert-comptable'

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
	amountWith4To7DigitsRegexp: {
		fr: /^[1-9](?:\d{0,2}(?:\s\d{3})?|(?:\s\d{3}){1,2})\s€$/,
		en: /^€[1-9](?:\d{0,2}(?:,\d{3})?|(?:,\d{3}){1,2})$/,
	},
}

type Options = {
	avecCharges?: boolean
	beforeAction?: () => void
}

export const runSimulateurTest = (
	simulateur: Simulateur,
	options: Options = {}
) => {
	const { avecCharges = false, beforeAction = () => {} } = options

	describe(
		`Le simulateur ${simulateur}`,
		{ testIsolation: false },
		function () {
			before(function () {
				cy.visit(encodeURI(`/${variableNames.url[lang]}/${simulateur}`))
				beforeAction?.()
			})

			it("devrait s'afficher", function () {
				cy.get(inputSelector)
			})

			it("devrait afficher les questions lorsqu'un champ est rempli", function () {
				cy.contains(variableNames.question[lang]).should('not.exist')

				cy.get(inputSelector).first().type('{selectall}1')

				cy.contains(variableNames.question[lang]).should('be.visible')
			})

			it('devrait afficher un résultat pour chaque champ rempli', function () {
				cy.contains(variableNames.yearTab[lang]).click()
				if (avecCharges) {
					cy.get(chargeInputSelector).type('{selectall}1000')
				}
				cy.get(inputSelector).each(($testedInput) => {
					cy.wrap($testedInput).type('{selectall}60111')

					cy.get(inputSelector).each(($input) => {
						if ($testedInput.get(0) !== $input.get(0)) {
							cy.wrap($input).should(($input) => {
								const inputValue = $input.val()
								expect(inputValue).to.match(
									variableNames.amountWith4To7DigitsRegexp[lang]
								)
								expect(inputValue).not.to.match(/^(?:60\s111\s€)|(€60,111)$/)
							})
						}
					})
					cy.contains(variableNames.contributions[lang])
				})
			})

			it("devrait permettre de changer d'échelle temporelle", function () {
				cy.contains(variableNames.yearTab[lang]).click()
				cy.get(inputSelector).first().type('{selectall}12000')
				if (avecCharges) {
					cy.get(chargeInputSelector).type('{selectall}6000')
				}

				cy.get(inputSelector).eq(1).invoke('val').should('not.be.empty')

				cy.contains(variableNames.monthTab[lang]).click()
				cy.get(inputSelector)
					.first()
					.invoke('val')
					.should('match', /^€?1[\s,]000(?:\s€)?$/)

				if (['indépendant', 'profession-liberale'].includes(simulateur)) {
					cy.get(chargeInputSelector)
						.first()
						.invoke('val')
						.should('match', /^€?500(?:\s€)?$/)
				}
			})

			it("devrait permettre d'accéder à la documentation et d'en revenir", function () {
				cy.get(inputSelector).first().type('{selectall}2000')
				cy.contains(variableNames.contributions[lang]).as('docButton')
				cy.get('@docButton').click()
				cy.location().should((loc) => {
					expect(loc.pathname).to.match(/\/documentation\/.*\/cotisations.*/)
				})

				cy.contains('← ').as('backButton')
				cy.get('@backButton').click()

				cy.get(inputSelector)
					.first()
					.invoke('val')
					.should('match', /^€?2[\s,]000(?:\s€)?$/)
			})

			it('devrait être accessible', function () {
				checkA11Y()
			})
		}
	)
}
