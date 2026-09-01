import { PageMetadataParams } from '../_configs/types'

export function commerçantMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'commerçant',
		pathId: 'simulateurs.commerçant',
		path: sitePaths.simulateurs.commerçant,
		iframePath: 'commerçant',
		icône: '🛒',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'commerçant',
		},
		title: t(
			'pages.simulateurs.commerçant.title',
			'Simulateur de revenus pour commerçants'
		),
		shortName: t('pages.simulateurs.commerçant.shortname', 'Commerçant'),
		meta: {
			title: t(
				'pages.simulateurs.commerçant.meta.title',
				'Commerçants : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.commerçant.meta.description',
				"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement pour les commerçants indépendants."
			),
		},
	} as const
}
