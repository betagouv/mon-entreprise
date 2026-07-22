import { SimulatorsDataParams } from '../_configs/types'

export function pharmacienMetadata({ t, sitePaths }: SimulatorsDataParams) {
	return {
		id: 'pharmacien',
		pathId: 'simulateurs.profession-libérale.pharmacien',
		path: sitePaths.simulateurs['profession-libérale'].pharmacien,
		iframePath: 'pharmacien',
		icône: '⚕️',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'pharmacien',
		},
		title: t(
			'pages.simulateurs.pharmacien.title',
			'Simulateur de revenus pour pharmacien en libéral'
		),
		shortName: t('pages.simulateurs.pharmacien.shortname', 'Pharmacien'),
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
		codesCatégorieJuridique: ['1000', '5410', '5499'],
	} as const
}
