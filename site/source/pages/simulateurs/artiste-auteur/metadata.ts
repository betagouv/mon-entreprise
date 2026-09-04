import { PageMetadataParams } from '../_configs/types'

export function artisteAuteurMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'artiste-auteur',
		pathId: 'simulateurs.artiste-auteur',
		path: sitePaths.simulateurs['artiste-auteur'],
		iframePath: 'simulateur-artiste-auteur',
		icône: '👩‍🎨',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'artiste-auteur',
		},
		title: t(
			'pages.simulateurs.artiste-auteur.title',
			'Simulateur de cotisations d’artiste-auteur'
		),
		shortName: t(
			'pages.simulateurs.artiste-auteur.shortname',
			'Artiste-auteur'
		),
		meta: {
			title: t(
				'pages.simulateurs.artiste-auteur.meta.title',
				'Artiste-auteur: calcul des cotisations Urssaf'
			),
			description: t(
				'pages.simulateurs.artiste-auteur.meta.description',
				'Estimez les cotisations sociales sur les droits d’auteur et sur le revenu BNC.'
			),
		},
		codesCatégorieJuridique: ['1000'],
	} as const
}
