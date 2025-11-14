import rules from 'modele-social'
import { it } from 'vitest'

import { configComparateurStatuts } from '@/pages/simulateurs/comparaison-statuts/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import situations from './comparateur-statuts.yaml'
import { runSimulations } from './utils'

it('calculate comparateur-statuts', () => {
	runSimulations(
		engineFactory(rules),
		situations,
		[
			...(configComparateurStatuts['objectifs exclusifs'] ?? []),
			...(configComparateurStatuts.objectifs ?? []),
		],
		configComparateurStatuts.situation
	)
})
