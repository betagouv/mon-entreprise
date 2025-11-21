import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePLR } from '@/external-links/servicePLR'
import { IndépendantPLSimulation } from '@/pages/simulateurs/indépendant/IndépendantPLSimulation'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import cipavSimulationConfig from './simulationConfig'

export function cipavConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'cipav',
		icône: '📐',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'cipav',
		},
		pathId: 'simulateurs.profession-libérale.cipav',
		iframePath: 'cipav',
		meta: {
			title: t(
				'pages.simulateurs.cipav.meta.title',
				'Professions libérales rattachées à la Cipav : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.cipav.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes pour professions libérales rattaché à la CIPAV'
			),
		},
		shortName: t('pages.simulateurs.cipav.shortname', 'Cipav'),

		title: t(
			'pages.simulateurs.cipav.title',
			'Simulateur de revenus pour professions libérales Cipav'
		),
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [servicePLR],
		path: sitePaths.simulateurs['profession-libérale'].cipav,
		simulation: cipavSimulationConfig,
		codesCatégorieJuridique: ['1000', '5410', '5499'],
		component: IndépendantPLSimulation,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
