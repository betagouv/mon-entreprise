import Créer from '../../Creer/Home'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function choixStatutConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'choix-statut',
		path: sitePaths.créer.guideStatut.index,
		tracking: {
			chapter1: 'creer',
			chapter2: 'guide',
		},
		meta: {
			title: t(
				'pages.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.choix-statut.meta.description',
				'SASU, EURL, auto-entrepreneur, EIRL : choisissez le statut qui vous convient le mieux grâce à cet assistant'
			),
		},
		icône: '📚',
		pathId: 'créer.guideStatut.index',
		title: t(
			'pages.choix-statut.title',
			'Assistant au choix du statut juridique'
		),
		iframePath: 'choix-statut-juridique',
		shortName: t('pages.choix-statut.shortname', 'Assistant statut juridique'),
		component: Créer,
	} as const)
}
