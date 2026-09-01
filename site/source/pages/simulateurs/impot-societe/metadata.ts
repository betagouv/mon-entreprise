import { PageMetadataParams } from '../_configs/types'

export function impôtSociétéMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'is',
		pathId: 'simulateurs.is',
		path: sitePaths.simulateurs.is,
		iframePath: 'impot-societe',
		icône: '🗓',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'impot-societe',
		},
		title: t(
			'pages.simulateurs.impot-société.title',
			'Simulateur d’impôt sur les sociétés'
		),
		shortName: t(
			'pages.simulateurs.impot-société.meta.title',
			'Impôt sur les sociétés'
		),
		meta: {
			title: t(
				'pages.simulateurs.impot-société.meta.title',
				'Impôt sur les sociétés'
			),
			description: t(
				'pages.simulateurs.impot-société.meta.description',
				'Calculez votre impôt sur les sociétés.'
			),
		},
	} as const
}
