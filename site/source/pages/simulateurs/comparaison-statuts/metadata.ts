import { SimulatorsDataParams } from '../_configs/types'

export function comparaisonStatutsMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'comparaison-statuts',
		pathId: 'simulateurs.comparaison',
		path: sitePaths.simulateurs.comparaison,
		iframePath: 'comparaison-statuts',
		icône: '📊',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'comparaison_statut',
		},
		title: t(
			'pages.simulateurs.comparaison-statuts.title',
			'Comparateur de statut juridique'
		),
		shortName: t(
			'pages.simulateurs.comparaison-statuts.shortname',
			'Comparaison des statuts'
		),
		meta: {
			title: t(
				'pages.simulateurs.comparaison-statuts.meta.title',
				'Comparateur de statut juridique'
			),
			description: t(
				'pages.simulateurs.comparaison-statuts.meta.description',
				'Auto-entrepreneur, EI/EURL ou SASU ? Simulez les différences de revenu, retraite et indemnités maladie'
			),
		},
	} as const
}
