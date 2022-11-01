import { configIndépendant } from '@/pages/Simulateurs/configs/indépendant'
import { DottedName } from 'modele-social'
import { it } from 'vitest'
import independentSituations from './simulations-indépendant.yaml'
import { runSimulations } from './utils'

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . cotisations',
		'dirigeant . rémunération . net',
		'dirigeant . indépendant . revenu professionnel',
		'impôt . montant',
		'dirigeant . rémunération . net . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'dirigeant . indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(independentSituations, objectifs, configIndépendant.situation)
})
