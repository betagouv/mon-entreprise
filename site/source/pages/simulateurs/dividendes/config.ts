import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import DividendesSimulation from './Dividendes'
import { dividendesMetadata } from './metadata'
import { SeoExplanations } from './SeoExplanations'
import { configDividendes } from './simulationConfig'

export function dividendesConfig(params: SimulatorsDataParams) {
	return config({
		...dividendesMetadata(params),
		nextSteps: ['salarié', 'is', 'comparaison-statuts'],
		simulation: configDividendes,
		component: DividendesSimulation,
		seoExplanations: SeoExplanations,
	} as const)
}
