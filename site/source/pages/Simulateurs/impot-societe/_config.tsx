import ISSimulation, { SeoExplanations } from '.'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import ISSimulationConfig from './_simulationConfig'

export function impôtSociétéConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'is',
		beta: true,
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
