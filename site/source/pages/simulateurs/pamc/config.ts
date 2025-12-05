import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePAM } from '@/external-links/servicePAM'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configProfessionLibérale } from '../profession-libérale/simulationConfig'
import PAMCHome from './PAMCHome'

export function pamcConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'pamc',
		private: true,
		iframePath: 'pamc',
		tracking: {},
		title: t(
			'pages.simulateurs.pamc.title',

			'Simulateur de cotisations et de revenu pour les PAMC'
		),
		pathId: 'simulateurs.pamc',
		icône: '🏥',
		meta: {
			title: t('pages.simulateurs.pamc.meta.title', 'Simulateurs régime PAMC'),
			description: t(
				'pages.simulateurs.pamc.meta.description',
				'Calcul du revenu net pour les professions libérales du régime PAMC (médecin, chirurgien-dentiste, sage-femme et auxiliaire médical)'
			),
		},
		shortName: t('pages.simulateurs.pamc.shortname', 'PAMC'),
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [servicePAM],
		path: sitePaths.simulateurs.pamc,
		simulation: configProfessionLibérale,
		component: PAMCHome,
	} as const)
}
