import { PageMetadataParams } from '../_configs/types'

export function entrepriseIndividuelleMetadata({
	t,
	sitePaths,
}: PageMetadataParams) {
	return {
		id: 'entreprise-individuelle',
		pathId: 'simulateurs.entreprise-individuelle',
		path: sitePaths.simulateurs['entreprise-individuelle'],
		iframePath: 'simulateur-EI',
		icône: '🚶‍♀️',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'EI',
		},
		title: t(
			'pages.simulateurs.ei.title',
			'Simulateur pour entreprise individuelle (EI)'
		),
		shortName: t('pages.simulateurs.ei.shortname', 'Entreprise Individuelle'),
		meta: {
			title: t(
				'pages.simulateurs.ei.meta.titre',
				'Entreprise individuelle (EI) : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.ei.meta.description',
				"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts."
			),
		},
		codesCatégorieJuridique: ['1000'],
	} as const
}
