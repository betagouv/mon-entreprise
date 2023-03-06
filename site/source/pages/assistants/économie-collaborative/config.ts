import ÉconomieCollaborative from '.'
import { config } from '../../simulateurs/configs/config'
import { SimulatorsDataParams } from '../../simulateurs/configs/types'

export function économieCollaborativeConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		beta: true,
		id: 'économie-collaborative',
		pathId: 'assistants.économieCollaborative.index',
		path: sitePaths.assistants.économieCollaborative.index,
		iframePath: 'economie-collaborative',
		tracking: 'economie_collaborative',
		icône: '🙋',
		title: t(
			'pages.économie-collaborative.title',
			'Assistant à la déclaration des revenus des plateformes en ligne'
		),
		shortName: t(
			'pages.économie-collaborative.shortname',
			'Assistant économie collaborative'
		),
		meta: {
			title: t(
				'pages.économie-collaborative.meta.title',
				'Déclaration des revenus des plateforme en ligne : guide intéractif'
			),
			description: t(
				'pages.économie-collaborative.meta.description',
				'Airbnb, Drivy, Blablacar, Leboncoin... Découvrez comment être en règle dans vos déclarations'
			),
		},
		component: ÉconomieCollaborative,
	} as const)
}
