import { SimulatorsDataParams } from '../_configs/types'

export function lodeomMetadata({ t, sitePaths }: SimulatorsDataParams) {
	return {
		id: 'lodeom',
		pathId: 'simulateurs.lodeom',
		path: sitePaths.simulateurs.lodeom,
		iframePath: 'simulateur-lodeom',
		icône: '🏷️',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'lodeom',
		},
		title: t(
			'pages.simulateurs.lodeom.title',
			"Simulateur d'exonération Lodeom"
		),
		shortName: t('pages.simulateurs.lodeom.shortname', 'Exonération Lodeom'),
		meta: {
			title: t('pages.simulateurs.lodeom.meta.title', 'Exonération Lodeom'),
			description: t(
				'pages.simulateurs.lodeom.meta.description',
				"Estimation du montant de l'exonération Lodeom. Cette exonération est applicable, sous conditions, aux salariés d'Outre-mer."
			),
		},
	} as const
}
