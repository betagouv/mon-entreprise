import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AvertissementProfessionLibérale } from './AvertissementProfessionLiberale'
import { ProfessionLibérale } from './ProfessionLiberale'
import { configProfessionLibérale } from './simulationConfig'

export function professionLibéraleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'profession-liberale',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
		},
		icône: '💻',
		meta: {
			title: t(
				'pages.simulateurs.profession-liberale.meta.title',
				'Professions libérale : le simulateur Urssaf'
			),
			description: t(
				'pages.simulateurs.profession-liberale.meta.description',
				"Calcul du revenu net pour les independants en libéral à l'impôt sur le revenu (IR, BNC)"
			),
		},
		iframePath: 'profession-liberale',
		pathId: 'simulateurs.profession-liberale.index',
		shortName: t(
			'pages.simulateurs.profession-liberale.shortname',
			'Profession libérale'
		),
		title: t(
			'pages.simulateurs.profession-liberale.title',
			'Simulateur de revenus pour profession libérale'
		),
		path: sitePaths.simulateurs['profession-liberale'].index,
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
		component: ProfessionLibérale,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementProfessionLibérale,
	} as const)
}
