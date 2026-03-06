import ISSimulation, { SeoExplanations } from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ISSimulationConfig from './simulationConfig'

export function impôtSociétéConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'is',
		icône: '🗓',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'impot-societe',
		},
		pathId: 'simulateurs.is',
		iframePath: 'impot-societe',
		meta: {
			title: t(
				'pages.simulateurs.impot-société.meta.title',
				'Impôt sur les sociétés'
			),
			description: t(
				'pages.simulateurs.impot-société.meta.description',
				'Calculez votre impôt sur les sociétés'
			),
		},
		shortName: t(
			'pages.simulateurs.impot-société.meta.title',
			'Impôt sur les sociétés'
		),
		title: t(
			'pages.simulateurs.impot-société.title',
			'Simulateur d’impôt sur les sociétés'
		),
		path: sitePaths.simulateurs.is,
		hideDate: true,
		component: ISSimulation,
		seoExplanations: SeoExplanations,
		simulation: ISSimulationConfig,
	} as const)
}
