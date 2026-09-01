import { PageMetadataParams } from '../_configs/types'

export function autoEntrepreneurMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'auto-entrepreneur',
		pathId: 'simulateurs.auto-entrepreneur',
		path: sitePaths.simulateurs['auto-entrepreneur'],
		iframePath: 'simulateur-autoentrepreneur',
		icône: '🚶‍♂️',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'auto_entrepreneur',
		},
		title: t(
			'pages.simulateurs.auto-entrepreneur.title',
			'Simulateur de revenus auto-entrepreneur'
		),
		shortName: t(
			'pages.simulateurs.auto-entrepreneur.shortname',
			'Auto-entrepreneur'
		),
		meta: {
			title: t(
				'pages.simulateurs.auto-entrepreneur.meta.titre',
				'Auto-entrepreneurs : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.auto-entrepreneur.meta.description',
				'Calculez votre revenu net après cotisations et impôts en tenant compte de toutes les options, y compris Acre et versement libératoire.'
			),
		},
		codesCatégorieJuridique: ['1000'],
	} as const
}
