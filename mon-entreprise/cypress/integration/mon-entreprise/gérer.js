describe('Manage page test', function() {
	const fr = Cypress.env('language') === 'fr'
	beforeEach(() => {
		cy.visit(fr ? '/gérer' : '/manage')
	})
	it('should not crash', function() {
		cy.contains(fr ? 'Gérer mon activité' : 'Manage my business')
	})
	it('should allow to retrieve company and show link corresponding to the legal status', function() {
		cy.get('button.cta').click()
		cy.get('input')
			.first()
			.type('menoz')
		cy.contains('834364291').click()
		cy.contains(fr ? 'simulateur SASU' : 'simulator for SASU').click()
		cy.location().should(loc => {
			expect(loc.pathname).to.match(fr ? /dirigeant-sasu$/ : /sasu-chairman$/)
		})
	})
	it('should allow auto entrepreneur to access the corresponding income simulator', function() {
		cy.get('button.cta').click()
		cy.get('input')
			.first()
			.type('gwenael girod')
		cy.contains('MONSIEUR').click()
		// ask if auto-entrepreneur
		cy.contains(
			fr ? 'Êtes-vous auto-entrepreneur ?' : 'Are you auto-entrepreneur?'
		)
		cy.contains(fr ? 'Oui' : 'Yes').click()
		cy.contains(
			fr ? 'simulateur auto-entrepreneur' : 'simulator for auto-entrepreneur'
		).click()
		cy.location().should(loc => {
			expect(loc.pathname).to.match(/auto-entrepreneur$/)
		})
	})
	it('should be able to navigate to the hiring simulator', function() {
		cy.contains(fr ? 'une embauche' : 'hiring').click()
		cy.contains(fr ? 'salarié' : 'employee')
	})
})
