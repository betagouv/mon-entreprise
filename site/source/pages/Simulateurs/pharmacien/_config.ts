import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function pharmacienConfig({ t }: SimulatorsDataParams) {
	return config({
		id: 'pharmacien',
		tracking: {
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
	} as const)
}
