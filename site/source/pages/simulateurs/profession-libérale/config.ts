import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import { IndépendantPLSimulation } from '@/pages/simulateurs/indépendant/IndépendantPLSimulation'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configProfessionLibérale } from './simulationConfig'

export function professionLibéraleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'profession-libérale',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
		},
		icône: '💻',
		meta: {
			title: t(
				'pages.simulateurs.profession-libérale.meta.title',
				'Professions libérale : le simulateur Urssaf'
			),
			description: t(
				'pages.simulateurs.profession-libérale.meta.description',
				"Calcul du revenu net pour les indépendants en libéral à l'impôt sur le revenu (IR, BNC)"
			),
		},
		iframePath: 'profession-liberale',
		pathId: 'simulateurs.profession-libérale.index',
		shortName: t(
			'pages.simulateurs.profession-libérale.shortname',
			'Profession libérale'
		),
		title: t(
			'pages.simulateurs.profession-libérale.title',
			'Simulateur de revenus pour profession libérale'
		),
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [
			serviceIndépendant,
			servicePLR,
			servicePAM,
			serviceExpertComptable,
		],
		path: sitePaths.simulateurs['profession-libérale'].index,
		simulation: configProfessionLibérale,
		codesCatégorieJuridique: [
			'1000',
			'5410',
			'5415',
			'5422',
			'5458',
			'5459',
			'5460',
			'5499',
		],
		component: IndépendantPLSimulation,
		conseillersEntreprisesVariant: 'professions_liberales',
	} as const)
}
