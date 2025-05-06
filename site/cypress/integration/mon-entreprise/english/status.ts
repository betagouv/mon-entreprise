// TODO: fix this test after the new status guide is implemented
describe.skip('Status guide', function () {
	const fr = Cypress.env('language') === 'fr'

	beforeEach(function () {
		cy.visit(fr ? encodeURI('/créer') : '/create')
		cy.contains(fr ? 'Trouver le bon statut' : 'Find the right status').click({
			waitForAnimations: true,
		})
	})

	it('should allow to go back clicking on the previous answers', function () {
		cy.contains('button', fr ? 'Seul' : 'Alone').click()
		cy.contains(fr ? 'Un seul associé' : 'Only one partner').click()
		cy.contains(fr ? 'Seul ou à plusieurs' : 'Number of partners')
	})

	it('should guide thought the SASU status', function () {
		cy.contains('button', fr ? 'Seul' : 'Alone').click()

		cy.contains('button', fr ? 'Société' : 'Limited liability company').click()

		cy.contains('button', 'Assimilé').click()
		cy.contains('a', fr ? 'Créer une SASU' : 'Create a SASU').click()
		cy.url().should('match', /\/SASU$/)
	})
})
