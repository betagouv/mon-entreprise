const salaryInput = inputTitle => {
	const inputContainer = cy
		.contains(inputTitle)
		.closest('.main')
		.find('.targetInputOrValue')
	inputContainer.click()
	return inputContainer.find('input')
}

describe('Landing basic test', function() {
	it('should display the simulateur after loading', function() {
		cy.visit('/')
		cy.contains('Versé sur son compte bancaire')
	})
	it('should display cotisation repartition when entering net salary', function() {
		cy.visit('/')
		salaryInput('Salaire net').type('2000')
		cy.get('.distribution-chart__container')
	})
	it('should allow to navigate to a documentation page', function() {
		cy.visit('/')
		salaryInput('Salaire net').type('2000')
		cy.contains('Total chargé').click()
		cy.contains(
			`C'est le total que l'employeur doit verser pour employer un salarié`
		)
	})
})

describe('Simulation saving test', function() {
	it('should save the current simulation', function() {
		cy.visit('/')
		salaryInput('Salaire net').type('5471')
		cy.wait(1000)
		cy.contains('CDD').click()
		cy.contains('passer').click()
		cy.contains('passer').click()
		// Wanted to use cypress.clock(), but can't because of piwik changing Date prototype (!)
		cy.wait(1100)
		cy.visit('/')
		cy.contains('Retrouver ma simulation').click()
		salaryInput('Salaire net').should('have.value', '5471')
	})
})
