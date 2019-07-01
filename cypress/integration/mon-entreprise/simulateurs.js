const salaryInput = inputTitle => {
	const inputContainer = cy
		.contains(inputTitle)
		.closest('.main')
		.find('.targetInputOrValue')
	inputContainer.click()
	return inputContainer.find('input')
}

describe('Simulateurs test', function() {
	const fr = Cypress.env('language') === 'fr'

	it('should not crash', function() {
		cy.visit(fr ? '/sécurité-sociale' : '/social-security')
		cy.contains(
			fr ? 'Que souhaitez-vous estimer ?' : 'What do you want to estimate?'
		)
	})
	it('should display selection page', function() {
		cy.visit(fr ? '/sécurité-sociale' : '/social-security')
		cy.contains(fr ? 'Mon revenu' : 'My income').click()
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
	it('donne une estimation pour le revenu des indépendants', function() {
		cy.visit(
			fr ? '/sécurité-sociale/indépendant' : '/social-security/self-employed'
		)
		salaryInput(fr ? 'Rémunération totale' : 'Director total income').type(
			100000,
			{
				force: true
			}
		)
		cy.contains(fr ? 'Cotisations et contributions' : 'All contributions')
		cy.contains(fr ? "Type d'activité" : 'Activity type').click()
		cy.contains(
			fr
				? "Quelle est votre catégorie d'activité"
				: 'What is your category of activity'
		)
	})
})
