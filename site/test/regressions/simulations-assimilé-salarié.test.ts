import { it } from 'vitest'

import { configRémunérationDirigeant } from '@/pages/Simulateurs/configs/rémunérationDirigeant'

import rémunérationDirigeantSituations from './simulations-assimilé-salarié.yaml'
import { runSimulations } from './utils'

it('calculate assimilé salarié', () => {
	runSimulations(
		rémunérationDirigeantSituations,
		[
			...(configRémunérationDirigeant['objectifs exclusifs'] ?? []),
			...(configRémunérationDirigeant.objectifs ?? []),
		],
		{
			...configRémunérationDirigeant.situation,
			'dirigeant . régime social': "'assimilé salarié'",
		}
	)
})
