import ChoixDuStatut from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

export function choixStatutJuridiqueConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'choix-statut',
		pathId: 'assistants.choix-du-statut.index',
		path: sitePaths.assistants['choix-du-statut'].index,
		iframePath: 'choix-statut-juridique',
		icône: '📚',
		beta: true,
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
		title: t('pages.choix-statut.title', 'Choisir votre statut'),
		shortName: t('pages.choix-statut.shortname', 'Assistant statut juridique'),
		component: ChoixDuStatut,
		simulation: {
			situation: {
				'entreprise . catégorie juridique . remplacements': 'non',
				salarié: 'non',
			},
		},
		autoloadLastSimulation: true,
	} as const)
}
