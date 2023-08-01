import { it } from 'vitest'

import { configSalarié } from '@/pages/simulateurs/salarié/simulationConfig'

import employeeSituations from './convention-collective.yaml'
import { runSimulations } from './utils'

it('calculate simulations-salarié', () => {
	runSimulations(
		employeeSituations,
		[
			...(configSalarié['objectifs exclusifs'] ?? []),
			...(configSalarié.objectifs ?? []),
		],
		configSalarié.situation
	)
})
