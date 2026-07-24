import { PageMetadataParams } from '../_configs/types'

export function dividendesMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'dividendes',
		pathId: 'simulateurs.dividendes',
		path: sitePaths.simulateurs.dividendes,
		iframePath: 'dividendes',
		icône: '🎩',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'dividendes',
		},
		title: t(
			'pages.simulateurs.dividendes.title',
			'Simulateur de versement de dividendes'
		),
		shortName: t('pages.simulateurs.dividendes.shortName', 'Dividendes'),
		meta: {
			title: t('pages.simulateurs.dividendes.meta.title', 'Dividendes'),
			description: t(
				'pages.simulateurs.dividendes.meta.description',
				"Calculez le montant de l'impôt et des cotisations sur les dividendes versés par votre entreprise."
			),
			color: '#E71D66',
		},
	} as const
}
