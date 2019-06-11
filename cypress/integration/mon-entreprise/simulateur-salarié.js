const salaryInput = inputTitle => {
	const inputContainer = cy
		.contains(inputTitle)
		.closest('.main')
		.find('.targetInputOrValue')
	inputContainer.click()
	return inputContainer.find('input')
}

const fr = Cypress.env('language') === 'fr'
if (fr) {
	beforeEach(() => {
		cy.visit('/sécurité-sociale/salarié')
	})
	describe('Basic test', function() {
		it('should display the simulateur after loading', function() {
			cy.contains('Salaire net')
		})
		it('should display cotisation repartition when entering net salary', function() {
			salaryInput('Salaire net').type('2000')
			cy.get('.distribution-chart__container')
		})
		it('should allow to navigate to a documentation page', function() {
			salaryInput('Salaire net').type('2000')
			cy.contains('Total chargé').click()
			cy.contains(
				`C'est le total que l'employeur doit verser pour employer un salarié`
			)
		})
	})

	describe('Simulation saving test', function() {
		it('should save the current simulation', function() {
			salaryInput('Salaire net').type('471')
			cy.wait(1000)
			cy.contains('Passer').click()
			cy.contains('Passer').click()
			cy.contains('Passer').click()
			// Wanted to use cypress.clock(), but can't because of piwik changing Date prototype (!)
			cy.wait(1100)
			cy.visit('/sécurité-sociale/salarié')
			cy.contains('Retrouver ma simulation').click()
			salaryInput('Salaire net').should('have.value', '471')
		})
	})
}
