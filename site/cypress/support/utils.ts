export const fr = Cypress.env('language') === 'fr'
export const baseUrl = Cypress.config('baseUrl')

type ViolationType = {
	description: string
}

export const checkA11Y = () => {
	cy.injectAxe()
	cy.configureAxe({})
	cy.checkA11y(
		null,
		null,
		(violations: ViolationType[]) => {
			if (violations.length > 0) {
				cy.log(
					`${violations.length} erreur${
						violations.length > 1 ? 's' : ''
					} d'accessibilité sur cette page :`
				)
				violations.forEach((violation, index) => {
					cy.log(`Violation ${index + 1} : ${violation.description}`)
				})
				cy.log(
					'Pour y remédier, lancer la commande yarn start:axe-debugging en local.'
				)
			}
		},
		null
	)
}
