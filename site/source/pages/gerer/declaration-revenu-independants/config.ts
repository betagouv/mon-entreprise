import DéclarationRevenuIndépendant from '.'
import { config } from '../../Simulateurs/configs/config'
import { SimulatorsDataParams } from '../../Simulateurs/configs/types'

export function déclarationRevenuIndépendantBetaConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'déclaration-revenu-indépendant-beta',
		beta: true,
		tracking: {
			chapter1: 'gerer',
			chapter2: 'declaration_revenu_independant',
		},
		icône: '✍️',
		iframePath: 'déclaration-revenu-indépendant',
		meta: {
			description: t(
				'pages.gérer.declaration_revenu_indépendant.meta.description',
				'Découvrez quels montants remplir dans quelles cases, et obtenez une estimation des cotisations à payer en 2022'
			),
			title: t(
				'pages.gérer.declaration_revenu_indépendant.meta.title',
				'Assistant à la déclaration de revenu pour les indépendants'
			),
		},
		pathId: 'gérer.déclarationIndépendant.beta.index',
		shortName: t(
			'pages.gérer.declaration_revenu_indépendant.shortname',
			'Aide au remplissage de la déclaration de revenu'
		),
		title: t(
			'pages.gérer.declaration_revenu_indépendant.title',
			'Assistant à la déclaration de revenu pour les indépendants'
		),
		nextSteps: [
			'exonération-covid',
			'déclaration-charges-sociales-indépendant',
		],
		path: sitePaths.gérer.déclarationIndépendant.beta.index,
		component: DéclarationRevenuIndépendant,
	} as const)
}
