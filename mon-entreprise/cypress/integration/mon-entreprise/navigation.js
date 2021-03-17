describe('Navigation', function () {
	const fr = Cypress.env('language') === 'fr'
	it('should enable switching site language', () => {
		cy.visit(
			Cypress.env('site').replace(
				'${path}',
				fr ? '/créer/auto-entrepreneur' : '/create/auto-entrepreneur'
			)
		)
		cy.contains(fr ? 'Switch to English' : 'Passer en français').click()
		cy.url().should(
			'include',
			fr ? '/create/auto-entrepreneur' : '/cr%C3%A9er/auto-entrepreneur'
		)
	})

	it('should go back to home when clicking on logo', () => {
		cy.visit(
			Cypress.env('site').replace('${path}', '/documentation/contrat-salarié')
		)
		cy.get('img[alt^="logo mon-entreprise"]').click()
		cy.url().should('be', Cypress.baseUrl)
	})
})
