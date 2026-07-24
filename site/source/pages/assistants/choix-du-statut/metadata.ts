import { PageMetadataParams } from '../../simulateurs/_configs/types'

export function choixStatutJuridiqueMetadata({
	t,
	sitePaths,
}: PageMetadataParams) {
	return {
		id: 'choix-statut',
		pathId: 'assistants.choix-du-statut.index',
		path: sitePaths.assistants['choix-du-statut'].index,
		iframePath: 'choix-statut-juridique',
		icône: '💡',
		tracking: {
			chapter1: 'assistants',
			chapter2: 'choix_du_statut',
		},
		title: t('pages.assistants.choix-statut.title', 'Choisir votre statut'),
		shortName: t('pages.assistants.choix-statut.shortname', 'Choix du statut'),
		meta: {
			title: t(
				'pages.assistants.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.assistants.choix-statut.meta.description',
				"SAS, EURL, EI, auto-entrepreneur…  Ce simulateur vous aide à choisir le statut juridique le plus adapté à votre projet d'entreprise."
			),
		},
	} as const
}
