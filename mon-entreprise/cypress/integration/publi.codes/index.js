describe('Navigation', function() {
	it('landing should not crash', function() {
		cy.visit('/')
	})
	it('liste des mécanismes should not crash', function() {
		cy.contains('Liste des mécanismes').click()
		cy.contains('barème')
	})
	it('bac à sable should work', function() {
		cy.contains('Bac à sable').click()
		cy.wait(5000)
		cy.contains('Dépenses primeur')
		cy.contains('11,50')
	})
})
