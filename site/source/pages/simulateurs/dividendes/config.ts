import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import DividendesSimulation from './Dividendes'
import { SeoExplanations } from './SeoExplanations'
import { configDividendes } from './simulationConfig'

export function dividendesConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'dividendes',
		icône: '🎩',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'dividendes',
		},
		iframePath: 'dividendes',
		pathId: 'simulateurs.dividendes',
		meta: {
			title: t('pages.simulateurs.dividendes.meta.title', 'Dividendes'),
			description: t(
				'pages.simulateurs.dividendes.meta.description',
				"Calculez le montant de l'impôt et des cotisations sur les dividendes versés par votre entreprise."
			),
			color: '#E71D66',
		},
		shortName: t('pages.simulateurs.dividendes.shortName', 'Dividendes'),
		title: t(
			'pages.simulateurs.dividendes.title',
			'Simulateur de versement de dividendes'
		),
		nextSteps: ['salarié', 'is', 'comparaison-statuts'],
		path: sitePaths.simulateurs.dividendes,
		simulation: configDividendes,
		component: DividendesSimulation,
		seoExplanations: SeoExplanations,
	} as const)
}
