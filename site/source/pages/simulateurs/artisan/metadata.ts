import { PageMetadataParams } from '../_configs/types'

export function artisanMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'artisan',
		pathId: 'simulateurs.artisan',
		path: sitePaths.simulateurs.artisan,
		iframePath: 'artisan',
		icône: '🛠️',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'artisan',
		},
		title: t(
			'pages.simulateurs.artisan.title',
			'Simulateur de revenus pour artisans'
		),
		shortName: t('pages.simulateurs.artisan.shortname', 'Artisan'),
		meta: {
			title: t(
				'pages.simulateurs.artisan.meta.title',
				'Artisans : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.artisan.meta.description',
				"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement pour les artisans indépendants."
			),
		},
	} as const
}
