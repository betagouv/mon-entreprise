import { PageMetadataParams } from '../_configs/types'

export function expertComptableMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'expert-comptable',
		pathId: 'simulateurs.profession-libérale.expert-comptable',
		path: sitePaths.simulateurs['profession-libérale']['expert-comptable'],
		iframePath: 'expert-comptable',
		icône: '🧮',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'expert_comptable',
		},
		title: t(
			'pages.simulateurs.expert-comptable.title',
			'Simulateur de revenus pour expert comptable et commissaire aux comptes en libéral'
		),
		shortName: t(
			'pages.simulateurs.expert-comptable.shortname',
			'Expert-Comptable'
		),
		meta: {
			title: t(
				'pages.simulateurs.expert-comptable.meta.title',
				'Expert-comptable : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.expert-comptable.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410', '5499'],
	} as const
}
