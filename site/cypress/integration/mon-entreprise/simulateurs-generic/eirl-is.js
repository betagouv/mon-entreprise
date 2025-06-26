import { runSimulateurTest } from '../../../support/simulateur'

runSimulateurTest('eirl', {
	beforeAction: () => cy.contains('Impôt sur les sociétés').click(),
})
