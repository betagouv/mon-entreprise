import { runSimulateurTest } from '../../../support/simulateur'

runSimulateurTest('eurl', true, () =>
	cy.contains('Impôt sur le revenu').click()
)
