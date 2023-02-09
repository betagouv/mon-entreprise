import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import { IndépendantPLSimulation } from '../indépendant/Indépendant'
import { configProfessionLibérale } from './simulationConfig'

export function professionLibéraleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'profession-libérale',
		tracking: {
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
		path: sitePaths.simulateurs['profession-libérale'].index,
		simulation: configProfessionLibérale,
		component: IndépendantPLSimulation,
	} as const)
}
