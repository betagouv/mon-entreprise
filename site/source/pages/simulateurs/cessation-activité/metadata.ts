import { PageMetadataParams } from '../_configs/types'

export function cessationActivitéMetadata({
	t,
	sitePaths,
}: PageMetadataParams) {
	return {
		id: 'cessation-activité',
		pathId: 'simulateurs.cessation-activité',
		path: sitePaths.simulateurs['cessation-activité'],
		iframePath: 'simulateur-cessation-activité',
		icône: '📦',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cessation_activité',
		},
		title: t(
			'pages.simulateurs.cessation-activité.title',
			'Simulateur de cessation d’activité'
		),
		shortName: t(
			'pages.simulateurs.cessation-activité.shortname',
			'Cessation d’activité'
		),
		meta: {
			title: t(
				'pages.simulateurs.cessation-activité.meta.titre',
				'Simulateur de cessation d’activité'
			),
			description: t(
				'pages.simulateurs.cessation-activité.meta.description',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’indépendant.'
			),
		},
	} as const
}
