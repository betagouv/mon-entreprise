import { SimulatorsDataParams } from '../_configs/types'

export function professionLibéraleMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'profession-libérale',
		pathId: 'simulateurs.profession-libérale.index',
		path: sitePaths.simulateurs['profession-libérale'].index,
		iframePath: 'profession-liberale',
		icône: '💻',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
		},
		title: t(
			'pages.simulateurs.profession-libérale.title',
			'Simulateur de revenus pour profession libérale'
		),
		shortName: t(
			'pages.simulateurs.profession-libérale.shortname',
			'Profession libérale'
		),
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
	} as const
}
