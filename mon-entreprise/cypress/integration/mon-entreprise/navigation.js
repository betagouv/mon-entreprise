describe('Navigation', function () {
	const fr = Cypress.env('language') === 'fr'
	it('should enable switching site language', () => {
		cy.visit(
			fr ? encodeURI('/créer/auto-entrepreneur') : '/create/auto-entrepreneur'
		)
		cy.contains(fr ? 'Switch to English' : 'Passer en français').click()
		cy.url().should(
			'include',
			fr ? '/create/auto-entrepreneur' : encodeURI('/créer/auto-entrepreneur')
		)
	})

	it('should go back to home when clicking on logo', () => {
		cy.visit(encodeURI('/documentation/contrat-salarié'))
		cy.get('img[alt^="logo mon-entreprise"]').click()
		cy.url().should('match', new RegExp(`${Cypress.config().baseUrl}/?`))
	})
})
