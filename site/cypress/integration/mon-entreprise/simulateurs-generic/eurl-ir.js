import { runSimulateurTest } from '../../../support/simulateur'

runSimulateurTest('eurl', {
	avecCharges: true,
	beforeAction: () => cy.contains('Impôt sur le revenu').click(),
})
