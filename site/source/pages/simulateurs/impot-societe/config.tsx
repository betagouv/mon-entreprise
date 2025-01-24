import ISSimulation, { SeoExplanations } from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ISSimulationConfig from './simulationConfig'

export function impôtSociétéConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'is',
		icône: '🗓',
		tracking: 'impot-societe',
		pathId: 'simulateurs.is',
		iframePath: 'impot-societe',
		meta: {
			title: t('pages.simulateurs.is.meta.title', 'Impôt sur les sociétés'),
			description: t(
				'pages.simulateurs.is.meta.description',
				'Calculez votre impôt sur les sociétés'
			),
			color: '#E71D66',
		},
		shortName: t('pages.simulateurs.is.meta.title', 'Impôt sur les sociétés'),
		title: t(
			'pages.simulateurs.is.title',
			"Simulateur d'impôt sur les sociétés"
		),
		nextSteps: ['salarié', 'comparaison-statuts'],
		path: sitePaths.simulateurs.is,
		component: ISSimulation,
		seoExplanations: SeoExplanations,
		simulation: ISSimulationConfig,
	} as const)
}
