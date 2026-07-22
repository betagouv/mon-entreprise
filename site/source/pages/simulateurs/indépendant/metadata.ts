import { SimulatorsDataParams } from '../_configs/types'

export function indépendantMetadata({ t, sitePaths }: SimulatorsDataParams) {
	return {
		id: 'indépendant',
		pathId: 'simulateurs.indépendant',
		path: sitePaths.simulateurs.indépendant,
		iframePath: 'simulateur-independant',
		icône: '🏃',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'independant',
		},
		title: t(
			'pages.simulateurs.indépendant.title',
			'Simulateur de revenus pour indépendant'
		),
		shortName: t('pages.simulateurs.indépendant.shortname', 'Indépendant'),
		meta: {
			title: t(
				'pages.simulateurs.indépendant.meta.title',
				'Indépendant : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.indépendant.meta.description',
				"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement"
			),
		},
	} as const
}
