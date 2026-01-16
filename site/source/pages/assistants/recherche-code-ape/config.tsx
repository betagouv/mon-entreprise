import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import SearchCodeApePage from '.'
import { SeoExplanations } from './components/SeoExplanations'

export function rechercheCodeApeConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		beta: true,
		id: 'recherche-code-ape',
		pathId: 'assistants.recherche-code-ape',
		path: sitePaths.assistants['recherche-code-ape'],
		hideDate: true,
		iframePath: 'recherche-code-ape',
		icône: '🔍',
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
		tracking: {
			chapter1: 'assistants',
			chapter2: 'recherche_code_ape',
		},
		component: SearchCodeApePage,
		seoExplanations: SeoExplanations,
	} as const)
}
