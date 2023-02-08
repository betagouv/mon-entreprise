import { IndépendantPLSimulation } from '../Indépendant'
import { config } from '../configs/config'
import { configSageFemme } from '../configs/professionLibérale'
import { SimulatorsDataParams } from '../configs/types'

export function sageFemmeConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'sage-femme',
		icône: '👶',
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'sage_femme',
		},
		meta: {
			title: t(
				'pages.simulateurs.sage-femme.meta.title',
				'Sage-femme : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.sage-femme.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		iframePath: 'sage-femme',
		pathId: 'simulateurs.profession-libérale.sage-femme',
		shortName: t('pages.simulateurs.sage-femme.shortname', 'Sage-femme'),
		title: t(
			'pages.simulateurs.sage-femme.title',
			'Simulateur de revenus pour sage-femme en libéral'
		),
		path: sitePaths.simulateurs['profession-libérale']['sage-femme'],
		simulation: configSageFemme,
		component: IndépendantPLSimulation,
	} as const)
}
