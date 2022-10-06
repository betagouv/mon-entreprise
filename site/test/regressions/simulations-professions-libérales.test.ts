import { it } from 'vitest'
import professionLibéraleConfig from '../../source/pages/Simulateurs/configs/profession-libérale.yaml'
import professionsLibéralesSituations from './simulations-professions-libérales.yaml'
import { runSimulations } from './utils'

it('calculate simulations-professions-libérales', () => {
	runSimulations(
		professionsLibéralesSituations,
		professionLibéraleConfig.objectifs,
		{
			...professionLibéraleConfig.situation,
			'entreprise . activité . nature . libérale . réglementée': 'oui',
		}
	)
})
