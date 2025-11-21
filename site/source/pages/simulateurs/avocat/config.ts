import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePLR } from '@/external-links/servicePLR'
import ProfessionLibérale from '@/pages/simulateurs/profession-libérale/ProfessionLibérale'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configAvocat } from '../profession-libérale/simulationConfig'

export function avocatConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'avocat',
		tracking: {
			chapter1: 'simulateurs',
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
		externalLinks: [servicePLR, premiersMoisUrssaf],
		path: sitePaths.simulateurs['profession-libérale'].avocat,
		simulation: configAvocat,
		codesCatégorieJuridique: ['1000', '5410', '5499'],
		component: ProfessionLibérale,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
