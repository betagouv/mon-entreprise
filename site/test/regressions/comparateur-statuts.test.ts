import { it } from 'vitest'

import { configComparateurStatuts } from '@/pages/simulateurs/comparaison-statuts/simulationConfig'

import situations from './comparateur-statuts.yaml'
import { runSimulations } from './utils'

it('calculate comparateur-statuts', () => {
	runSimulations(
		situations,
		[
			...(configComparateurStatuts['objectifs exclusifs'] ?? []),
			...(configComparateurStatuts.objectifs ?? []),
		],
		configComparateurStatuts.situation
	)
})
