import { PageMetadataParams } from '../_configs/types'

export function coûtCréationEntrepriseMetadata({
	t,
	sitePaths,
}: PageMetadataParams) {
	return {
		id: 'coût-création-entreprise',
		pathId: 'simulateurs.coût-création-entreprise',
		path: sitePaths.simulateurs['coût-création-entreprise'],
		iframePath: 'cout-creation-entreprise',
		icône: '✨',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cout_creation_entreprise',
		},
		title: t(
			'pages.simulateurs.coût-création-entreprise.title',
			"Simulateur de coût de création d'une entreprise"
		),
		shortName: t(
			'pages.simulateurs.coût-création-entreprise.shortName',
			'Coût de création'
		),
		meta: {
			title: t(
				'pages.simulateurs.coût-création-entreprise.meta.title',
				"Coût de création d'une entreprise"
			),
			description: t(
				'pages.simulateurs.coût-création-entreprise.meta.description',
				"Estimez les coûts des formalités administratives obligatoires à la création d'une entreprise"
			),
		},
	} as const
}
