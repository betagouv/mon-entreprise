import { SimulationConfig } from '@/pages/simulateurs/_configs/types'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'

export const configCessationActivité: SimulationConfig = {
	...configIndépendant,
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . net',
	],
	'unité par défaut': '€/an',
	questions: {
		...configIndépendant.questions,
		'liste noire': [
			...(configIndépendant.questions?.['liste noire'] || []),
			'entreprise . TVA . franchise de TVA . notification',
			'entreprise . date de cessation',
		],
	},
}
