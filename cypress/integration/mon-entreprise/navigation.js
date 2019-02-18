describe('Navigation', function() {
	const fr = Cypress.env('language') === 'fr'
	it('should enable switching site language', () => {
		cy.visit(
			fr
				? '/entreprise/devenir-auto-entrepreneur'
				: '/company/become-auto-entrepreneur'
		)
		cy.contains(fr ? 'Switch to English' : 'Passer en français').click()
		cy.url().should(
			'include',
			fr
				? '/company/become-auto-entrepreneur'
				: '/entreprise/devenir-auto-entrepreneur'
		)
	})
})
