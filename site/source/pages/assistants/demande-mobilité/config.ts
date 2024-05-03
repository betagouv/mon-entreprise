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
		tracking: {
			chapter1: 'assistant',
			chapter2: 'demande_mobilite',
		},
		meta: {
			title: t(
				'pages.gérer.demande-mobilité.meta.title',
				'Travailleur indépendant : demande de mobilité en Europe'
			),
			description: t(
				'pages.gérer.demande-mobilité.meta.description',
				"Formulaire interactif à compléter en cas d'exercice d'une activité professionnelle à l'étranger"
			),
		},
		shortName: t(
			'pages.gérer.demande-mobilité.shortname',
			'Demande de mobilité internationale'
		),
		title: t(
			'pages.gérer.demande-mobilité.title',
			'Demande de mobilité internationale'
		),
		component: FormulaireMobilitéIndépendant,
	} as const)
}
