import { it } from 'vitest'

import { configArtisteAuteur } from '@/pages/simulateurs/artiste-auteur/simulationConfig'

import artisteAuteurSituations from './artiste-auteur.yaml'
import { runSimulations } from './utils'

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		[
			...(configArtisteAuteur['objectifs exclusifs'] ?? []),
			...(configArtisteAuteur.objectifs ?? []),
		],
		configArtisteAuteur.situation
	)
})
