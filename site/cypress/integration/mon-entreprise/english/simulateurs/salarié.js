import { runSimulateurTest } from '../../../../support/simulateur'

const fr = Cypress.env('language') === 'fr'

runSimulateurTest(fr ? 'salaire-brut-net' : 'salary')
