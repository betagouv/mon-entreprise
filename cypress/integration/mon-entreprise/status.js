describe('Status guide', function() {
	const fr = Cypress.env('language') === 'fr'
	beforeEach(() => {
		cy.visit(fr ? '/créer' : '/create')
		cy.get('.cta').click()
	})

	it('should allow to go back clicking on the previous answers', function() {
		cy.get('.ui__.answer-group')
			.contains(fr ? 'Seul' : 'Alone')
			.click()
		cy.contains(fr ? 'Un seul associé' : 'Only one partner').click()
		cy.contains(fr ? 'Seul ou à plusieurs' : 'Number of partners')
	})
	it('should guide thought the SASU status', function() {
		cy.get('.ui__.answer-group')
			.contains(fr ? 'Seul' : 'Alone')
			.click()
		cy.get('.ui__.answer-group')
			.contains(fr ? 'Société' : 'Limited liability company')
			.click()
		// The click fails randomly and unexplicablly on CI
		cy.wait(200)
		cy.get('.answer-group button')
			.contains('Assimilé')
			.click()
		cy.contains(fr ? 'Créer une SASU' : 'Create a SASU').click()
		cy.url().should('match', /\/SASU$/)
	})
})
