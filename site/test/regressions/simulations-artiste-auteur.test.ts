import { it } from 'vitest'
import artisteAuteurConfig from '../../source/pages/Simulateurs/configs/artiste-auteur.yaml'
import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
import { runSimulations } from './utils'

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		artisteAuteurConfig.objectifs,
		artisteAuteurConfig.situation
	)
})
