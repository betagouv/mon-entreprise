import { it } from 'vitest'
import remunerationDirigeantConfig from '../../source/pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import { runSimulations } from './utils'

it('calculate assimilé salarié', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			'dirigeant . régime social': "'assimilé salarié'",
		}
	)
})
