import { runSimulateurTest } from '../../../support/simulateur'

runSimulateurTest('eirl', false, () =>
	cy.contains('Impôt sur les sociétés').click()
)
