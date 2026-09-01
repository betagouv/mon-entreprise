import { PageMetadataParams } from '../_configs/types'

export function cipavMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'cipav',
		pathId: 'simulateurs.profession-libérale.cipav',
		path: sitePaths.simulateurs['profession-libérale'].cipav,
		iframePath: 'cipav',
		icône: '📐',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'cipav',
		},
		title: t(
			'pages.simulateurs.cipav.title',
			'Simulateur de revenus pour professions libérales Cipav'
		),
		shortName: t('pages.simulateurs.cipav.shortname', 'Cipav'),
		meta: {
			title: t(
				'pages.simulateurs.cipav.meta.title',
				'Professions libérales rattachées à la Cipav : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.cipav.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes pour professions libérales rattachées à la Cipav.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410', '5499'],
	} as const
}
