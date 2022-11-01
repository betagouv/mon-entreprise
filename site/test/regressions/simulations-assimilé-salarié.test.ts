import { configRémunérationDirigeant } from '@/pages/Simulateurs/configs/rémunérationDirigeant'
import { it } from 'vitest'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import { runSimulations } from './utils'

it('calculate assimilé salarié', () => {
	runSimulations(
		remunerationDirigeantSituations,
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
