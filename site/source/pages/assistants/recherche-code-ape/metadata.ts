import { PageMetadataParams } from '@/pages/simulateurs/_configs/types'

export function rechercheCodeApeMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'recherche-code-ape',
		pathId: 'assistants.recherche-code-ape',
		path: sitePaths.assistants['recherche-code-ape'],
		iframePath: 'recherche-code-ape',
		icône: '🔍',
		beta: true,
		tracking: {
			chapter1: 'assistants',
			chapter2: 'recherche_code_ape',
		},
		title: t(
			'pages.assistants.recherche-code-ape.title',
			'Quel code APE pour mon activité ? '
		),
		shortName: t(
			'pages.assistants.recherche-code-ape.shortname',
			'Recherche de code APE'
		),
		meta: {
			title: t(
				'pages.assistants.recherche-code-ape.meta.title',
				'Recherche de code APE'
			),
			description: t(
				'pages.assistants.recherche-code-ape.meta.description',
				'Assistant pour trouver le code APE qui correspond à votre activité.'
			),
		},
	} as const
}
