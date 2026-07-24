import { PageMetadataParams } from '../_configs/types'

export function sasuMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'sasu',
		pathId: 'simulateurs.sasu',
		path: sitePaths.simulateurs.sasu,
		iframePath: 'simulateur-assimilesalarie',
		icône: '📘',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'SASU',
		},
		title: t(
			'pages.simulateurs.sasu.title',
			'Simulateur de revenus pour dirigeant de SAS(U)'
		),
		shortName: t('pages.simulateurs.sasu.shortname', 'SAS(U)'),
		meta: {
			title: t(
				'pages.simulateurs.sasu.meta.titre',
				'SASU : simulateur de revenus pour dirigeant'
			),
			description: t(
				'pages.simulateurs.sasu.meta.description',
				'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
			),
		},
		codesCatégorieJuridique: ['5710'],
	} as const
}
