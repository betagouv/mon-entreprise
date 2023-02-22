import { config } from '@/pages/Simulateurs/configs/config'
import { SimulatorsDataParams } from '@/pages/Simulateurs/configs/types'

import SearchCodeApePage from '.'

export function rechercheCodeApeConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'recherche-code-ape',
		pathId: 'assistants.recherche-code-ape',
		path: sitePaths.assistants['recherche-code-ape'],
		iframePath: 'recherche-code-ape',
		icône: '🔍',
		title: t(
			'pages.assistants.recherche-code-ape.title',
			'Recherche de code APE'
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
		tracking: {},
		component: SearchCodeApePage,
	} as const)
}
