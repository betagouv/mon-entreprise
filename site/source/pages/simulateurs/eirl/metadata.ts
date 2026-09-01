import { PageMetadataParams } from '../_configs/types'

export function eirlMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'eirl',
		pathId: 'simulateurs.eirl',
		path: sitePaths.simulateurs.eirl,
		iframePath: 'simulateur-EIRL',
		icône: '🚶',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'EIRL',
		},
		title: t('pages.simulateurs.eirl.title', 'Simulateur de revenus pour EIRL'),
		shortName: t('pages.simulateurs.eirl.shortname', 'EIRL'),
		meta: {
			title: t(
				'pages.simulateurs.eirl.meta.titre',
				'EIRL : simulateur de revenus pour dirigeant'
			),
			description: t(
				'pages.simulateurs.eirl.meta.description',
				"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts."
			),
		},
		codesCatégorieJuridique: ['1000'],
	} as const
}
