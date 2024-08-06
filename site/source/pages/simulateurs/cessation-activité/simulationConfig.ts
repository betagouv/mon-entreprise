import { SimulationConfig } from '@/pages/simulateurs/_configs/types'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'

export const configCessationActivité: SimulationConfig = {
	...configIndépendant,
	'unité par défaut': '€/an',
}
