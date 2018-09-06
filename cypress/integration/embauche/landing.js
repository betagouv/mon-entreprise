const salaryInput = inputTitle => {
	const inputContainer = cy
		.contains(inputTitle)
		.closest('.main')
		.find('.targetInputOrValue')
	inputContainer.click()
	return inputContainer.find('input')
}
describe('Landing basic test', function() {
	it('should not crash when entering salary', function() {
		cy.visit('/')
	})
	it('should display the simulateur after loading', function() {
		cy.visit('/')
		cy.contains('Entrez un salaire mensuel')
	})
	it('should display cotisation repartition when entering net salary', function() {
		cy.visit('/')
		salaryInput('Salaire net').type('2000')
		cy.get('.distribution-chart__container')
	})
})
