import { it } from 'vitest'

import { configArtisteAuteur } from '@/pages/Simulateurs/configs/artisteAuteur'

import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
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
