import { SimulatorsDataParams } from '../_configs/types'

export function pamcMetadata({ t, sitePaths }: SimulatorsDataParams) {
	return {
		id: 'pamc',
		pathId: 'simulateurs.pamc',
		path: sitePaths.simulateurs.pamc,
		iframePath: 'pamc',
		icône: '🏥',
		private: true,
		tracking: {},
		title: t(
			'pages.simulateurs.pamc.title',

			'Simulateur de cotisations et de revenu pour les PAMC'
		),
		shortName: t('pages.simulateurs.pamc.shortname', 'PAMC'),
		meta: {
			title: t('pages.simulateurs.pamc.meta.title', 'Simulateurs régime PAMC'),
			description: t(
				'pages.simulateurs.pamc.meta.description',
				'Calcul du revenu net pour les professions libérales du régime PAMC (médecin, chirurgien-dentiste, sage-femme et auxiliaire médical)'
			),
		},
	} as const
}
