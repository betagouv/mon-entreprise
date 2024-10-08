import { checkA11Y, fr } from '../../support/utils'

describe('Secondary pages', function () {
	if (!fr) {
		return
	}

	it('Statistics page should not crash', function () {
		cy.visit('/stats')
		cy.contains('Statistiques')
	})

	it('Statistics page should be RGAA compliant', function () {
		cy.visit('/stats')
		cy.contains('Activer le mode accessibilité').click()
		cy.get('table').should('be.visible')
		checkA11Y()
	})

	it('News page should not crash', function () {
		cy.visit('/nouveautés')
		cy.contains('←').click()
		cy.url({ decode: true }).should('match', /\/nouveautés\/[^/]*$/)
	})

	it('News page should be RGAA compliant', function () {
		cy.visit('/nouveautés')
		cy.contains('←')
		// check a11y before first user input for react-aria select, cf https://github.com/adobe/react-spectrum/blob/23c3a91e7b87952f07da9da115188bd2abd99d77/packages/%40react-aria/select/src/HiddenSelect.tsx#L68-L70
		checkA11Y()
		cy.contains('←').click()
		cy.url({ decode: true }).should('match', /\/nouveautés\/[^/]*$/)
	})

	it('Budget page should not crash', function () {
		cy.visit('/budget')
		cy.contains('Budget')
		cy.get('button[data-cy="year-selector"]').click()
		cy.contains('2021').click()
	})

	it('Budget page should be RGAA compliant', function () {
		cy.visit('/budget')
		checkA11Y()
	})
})
