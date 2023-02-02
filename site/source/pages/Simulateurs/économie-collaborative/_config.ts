import ÉconomieCollaborative from '../EconomieCollaborative'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function économieCollaborativeConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'économie-collaborative',
		path: sitePaths.simulateurs.économieCollaborative.index,
		tracking: 'economie_collaborative',
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
		icône: '🙋',
		pathId: 'simulateurs.économieCollaborative.index',
		iframePath: 'economie-collaborative',
		shortName: t(
			'pages.économie-collaborative.shortname',
			'Assistant économie collaborative'
		),
		title: t(
			'pages.économie-collaborative.title',
			'Assistant à la déclaration des revenus des plateformes en ligne'
		),
		beta: true,
		component: ÉconomieCollaborative,
	} as const)
}
