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
			chapter1: 'assistant',
			chapter2: 'choix_du_statut',
		},
		meta: {
			title: t(
				'pages.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.choix-statut.meta.description',
				"SAS, EURL, EI, auto-entrepreneur...  Ce simulateur vous aide à choisir le statut juridique le plus adapté à votre projet d'entreprise."
			),
		},
		title: t('pages.choix-statut.title', 'Choisir votre statut'),
		shortName: t('pages.choix-statut.shortname', 'Choix du statut'),
		component: ChoixDuStatut,
		simulation: {
			situation: {
				'entreprise . catégorie juridique . remplacements': 'non',
				'entreprise . date de création': 'date',
				salarié: 'non',
			},
		},
		autoloadLastSimulation: true,
		nextSteps: false,
	} as const)
}
