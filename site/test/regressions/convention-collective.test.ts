import rules from 'modele-social'
import { it } from 'vitest'

import { configSalarié } from '@/pages/simulateurs/salarie/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import employeeSituations from './convention-collective.yaml'
import { runSimulations } from './utils'

it('calculate simulations-salarie', () => {
	runSimulations(
		engineFactory(rules),
		employeeSituations,
		[
			...(configSalarié['objectifs exclusifs'] ?? []),
			...(configSalarié.objectifs ?? []),
		],
		configSalarié.situation
	)
})
