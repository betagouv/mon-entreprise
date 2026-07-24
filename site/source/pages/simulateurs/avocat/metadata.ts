import { PageMetadataParams } from '../_configs/types'

export function avocatMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'avocat',
		pathId: 'simulateurs.profession-libérale.avocat',
		path: sitePaths.simulateurs['profession-libérale'].avocat,
		iframePath: 'avocat',
		icône: '⚖', // j'ai hesité avec 🥑 mais pas envie de me prendre un procès
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'avocat',
		},
		title: t(
			'pages.simulateurs.avocat.title',
			'Simulateur de revenus pour avocat en libéral'
		),
		shortName: t('pages.simulateurs.avocat.shortname', 'Avocat'),
		meta: {
			title: t(
				'pages.simulateurs.avocat.meta.title',
				'Avocat : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.avocat.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410', '5499'],
	} as const
}
