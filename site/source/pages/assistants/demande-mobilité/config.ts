import FormulaireMobilitéIndépendant from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

export function demandeMobilitéConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		private: true,
		id: 'demande-mobilité',
		pathId: 'assistants.formulaireMobilité',
		iframePath: 'demande-mobilite',
		path: sitePaths.assistants.formulaireMobilité,
		icône: '🧳',
		hideDate: true,
		tracking: {
			chapter1: 'assistant',
			chapter2: 'demande_mobilite',
		},
		meta: {
			title: t(
				'pages.simulateurs.demande-mobilité.meta.title',
				'Travailleur indépendant : demande de mobilité en Europe'
			),
			description: t(
				'pages.simulateurs.demande-mobilité.meta.description',
				"Formulaire interactif à compléter en cas d'exercice d'une activité professionnelle à l'étranger"
			),
		},
		shortName: t(
			'pages.simulateurs.demande-mobilité.shortname',
			'Demande de mobilité internationale'
		),
		title: t(
			'pages.simulateurs.demande-mobilité.title',
			'Demande de mobilité internationale'
		),
		component: FormulaireMobilitéIndépendant,
	} as const)
}
