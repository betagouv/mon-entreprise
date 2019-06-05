const salaryInput = inputTitle => {
	const inputContainer = cy
		.contains(inputTitle)
		.closest('.main')
		.find('.targetInputOrValue')
	inputContainer.click()
	return inputContainer.find('input')
}

describe('Landing test', function() {
	const fr = Cypress.env('language') === 'fr'

	it('should not crash', function() {
		cy.visit(fr ? '/sécurité-sociale' : '/social-security')
		cy.contains(
			fr ? 'Que souhaitez-vous estimer ?' : 'What do you want to estimate?'
		)
	})
	it('should display selection page', function() {
		cy.visit(fr ? '/sécurité-sociale' : '/social-security')
		cy.contains(
			fr ? 'La rémunération du dirigeant' : "The director's remuneration"
		).click()
		cy.contains(
			fr
				? 'Quel régime souhaitez-vous explorer ?'
				: 'Which social scheme would you like to explore?'
		)
		cy.contains('Indépendant').click({ force: true })
		cy.contains(
			fr
				? 'Simulateur de revenus pour indépendants'
				: 'Self-employed income simulator'
		)
	})
	it('should give an estimation for the self-employed income', function() {
		cy.visit(
			fr ? '/sécurité-sociale/indépendant' : '/social-security/self-employed'
		)
		salaryInput(fr ? "Chiffre d'affaires" : 'Turnover').type(100000, {
			force: true
		})
		cy.contains(fr ? 'Cotisations et contributions' : 'All contributions')
		cy.contains(fr ? 'ACRE' : 'ACRE').click()
		cy.contains(
			fr ? "Quel est l'âge de l'entreprise" : 'How old is the company'
		)
	})
})
