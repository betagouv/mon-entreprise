import rules from 'modele-as'
import { it } from 'vitest'

import { configSASU } from '@/pages/simulateurs/sasu/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import rémunérationSASUSituations from './SASU.yaml'
import { runSimulations } from './utils'

it('calculate assimilé salarié', () => {
	runSimulations(
		engineFactory(rules),
		rémunérationSASUSituations,
		[
			...(configSASU['objectifs exclusifs'] ?? []),
			...(configSASU.objectifs ?? []),
		],
		configSASU.situation
	)
})
