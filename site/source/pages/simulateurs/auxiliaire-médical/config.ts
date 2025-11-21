import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePAM } from '@/external-links/servicePAM'
import ProfessionLibérale from '@/pages/simulateurs/profession-libérale/ProfessionLibérale'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configAuxiliaire } from '../profession-libérale/simulationConfig'

export function auxiliaireMédicalConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'auxiliaire-médical',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'auxiliaire_medical',
		},
		tooltip: t(
			'pages.simulateurs.auxiliaire.tooltip',
			'Infirmiers, masseurs-kinésithérapeutes, pédicures-podologues, orthophonistes et orthoptistes'
		),
		icône: '🩹',
		iframePath: 'auxiliaire-medical',
		pathId: 'simulateurs.profession-libérale.auxiliaire',
		shortName: t(
			'pages.simulateurs.auxiliaire.shortname',
			'Auxiliaire médical'
		),
		title: t(
			'pages.simulateurs.auxiliaire.title',
			'Simulateur de revenus pour auxiliaire médical en libéral'
		),
		meta: {
			title: t(
				'pages.simulateurs.auxiliaire-medical.meta.title',
				'Auxiliaire médical : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.auxiliaire-medical.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes. Prise en compte des revenus non conventionnés.'
			),
		},
		externalLinks: [servicePAM, premiersMoisUrssaf],
		path: sitePaths.simulateurs['profession-libérale'].auxiliaire,
		simulation: configAuxiliaire,
		codesCatégorieJuridique: ['1000', '5410'],
		component: ProfessionLibérale,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
