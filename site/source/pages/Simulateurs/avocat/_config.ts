import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import { IndépendantPLSimulation } from '../indépendant/Indépendant'
import { configAvocat } from '../profession-libérale/_simulationConfig'

export function avocatConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'avocat',
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'avocat',
		},
		icône: '⚖', // j'ai hesité avec 🥑 mais pas envie de me prendre un procès
		iframePath: 'avocat',
		pathId: 'simulateurs.profession-libérale.avocat',
		shortName: t('pages.simulateurs.avocat.shortname', 'Avocat'),
		title: t(
			'pages.simulateurs.avocat.title',
			'Simulateur de revenus pour avocat en libéral'
		),
		meta: {
			title: t(
				'pages.simulateurs.avocat.meta.title',
				'Avocat : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.avocat.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		path: sitePaths.simulateurs['profession-libérale'].avocat,
		simulation: configAvocat,
		component: IndépendantPLSimulation,
	} as const)
}
