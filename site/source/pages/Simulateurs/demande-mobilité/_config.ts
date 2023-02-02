import FormulaireMobilitéIndépendant from '../../gerer/demande-mobilité'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function demandeMobilitéConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'demande-mobilité',
		tracking: {
			chapter1: 'gerer',
			chapter2: 'demande_mobilite',
		},
		icône: '🧳',
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
		pathId: 'gérer.formulaireMobilité',
		shortName: t(
			'pages.gérer.demande-mobilité.shortname',
			'Demande de mobilité internationale'
		),
		title: t(
			'pages.gérer.demande-mobilité.title',
			'Demande de mobilité internationale'
		),
		private: true,
		iframePath: 'demande-mobilite',
		path: sitePaths.gérer.formulaireMobilité,
		component: FormulaireMobilitéIndépendant,
	} as const)
}
