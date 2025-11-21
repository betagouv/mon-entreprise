import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import ProfessionLibérale from '@/pages/simulateurs/profession-libérale/ProfessionLibérale'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configExpertComptable } from '../profession-libérale/simulationConfig'

export function expertComptableConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'expert-comptable',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'expert_comptable',
		},
		icône: '🧮',
		iframePath: 'expert-comptable',
		pathId: 'simulateurs.profession-libérale.expert-comptable',
		shortName: t(
			'pages.simulateurs.expert-comptable.shortname',
			'Expert-Comptable'
		),
		title: t(
			'pages.simulateurs.expert-comptable.title',
			'Simulateur de revenus pour expert comptable et commissaire aux comptes en libéral'
		),
		meta: {
			title: t(
				'pages.simulateurs.expert-comptable.meta.title',
				'Expert-comptable : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.expert-comptable.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		externalLinks: [serviceExpertComptable, premiersMoisUrssaf],
		path: sitePaths.simulateurs['profession-libérale']['expert-comptable'],
		simulation: configExpertComptable,
		codesCatégorieJuridique: ['1000', '5410', '5499'],
		component: ProfessionLibérale,
	} as const)
}
