import { configRémunérationDirigeant } from '@/pages/Simulateurs/configs/rémunérationDirigeant'
import { it } from 'vitest'
import rémunérationDirigeantSituations from './simulations-assimilé-salarié.yaml'
import { runSimulations } from './utils'

it('calculate assimilé salarié', () => {
	runSimulations(
		rémunérationDirigeantSituations,
		[
			...(configRémunérationDirigeant.objectifs ?? []),
			...(configRémunérationDirigeant['objectifs cachés'] ?? []),
		],
		{
			...configRémunérationDirigeant.situation,
			'dirigeant . régime social': "'assimilé salarié'",
		}
	)
})
