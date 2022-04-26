import { it } from 'vitest'
import remunerationDirigeantConfig from '../../source/pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import { runSimulations } from './utils'

it('calculate simulations-rémunération-dirigeant (assimilé salarié)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			'dirigeant . régime social': "'assimilé salarié'",
		}
	)
})

it('calculate simulations-rémunération-dirigeant (auto-entrepreneur)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			'entreprise . catégorie juridique': "'EI'",
			'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
		}
	)
})

it('calculate simulations-rémunération-dirigeant (indépendant)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		remunerationDirigeantConfig.situation
	)
})
