import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePAM } from '@/external-links/servicePAM'
import ProfessionLibérale from '@/pages/simulateurs/profession-libérale/ProfessionLibérale'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configPharmacien } from '../profession-libérale/simulationConfig'

export function pharmacienConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'pharmacien',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'pharmacien',
		},
		meta: {
			title: t(
				'pages.simulateurs.pharmacien.meta.title',
				'Pharmacien : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.pharmacien.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes pour pharmacien en libéral'
			),
		},
		icône: '⚕️',
		iframePath: 'pharmacien',
		pathId: 'simulateurs.profession-libérale.pharmacien',
		shortName: t('pages.simulateurs.pharmacien.shortname', 'Pharmacien'),
		title: t(
			'pages.simulateurs.pharmacien.title',
			'Simulateur de revenus pour pharmacien en libéral'
		),
		externalLinks: [servicePAM, premiersMoisUrssaf],
		path: sitePaths.simulateurs['profession-libérale'].pharmacien,
		simulation: configPharmacien,
		codesCatégorieJuridique: ['1000', '5410', '5499'],
		component: ProfessionLibérale,
	} as const)
}
