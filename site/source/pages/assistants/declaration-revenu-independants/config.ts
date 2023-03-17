import DéclarationRevenuIndépendant from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

export function déclarationRevenuIndépendantBetaConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		beta: true,
		id: 'déclaration-revenu-indépendant',
		pathId: 'assistants.déclarationIndépendant.index',
		path: sitePaths.assistants.déclarationIndépendant.index,
		iframePath: 'déclaration-revenu-indépendant',
		icône: '✍️',
		tracking: {
			chapter1: 'gerer',
			chapter2: 'declaration_revenu_independant',
		},
		meta: {
			description: t(
				'pages.gérer.declaration_revenu_indépendant.meta.description',
				'Découvrez quels montants remplir dans quelles cases, et obtenez une estimation des cotisations à payer en 2023'
			),
			title: t(
				'pages.gérer.declaration_revenu_indépendant.meta.title',
				'Assistant à la déclaration de revenu pour les indépendants'
			),
		},
		shortName: t(
			'pages.gérer.declaration_revenu_indépendant.shortname',
			'Aide au remplissage de la déclaration de revenu'
		),
		title: t(
			'pages.gérer.declaration_revenu_indépendant.title',
			'Assistant à la déclaration de revenu pour les indépendants'
		),
		nextSteps: ['déclaration-charges-sociales-indépendant'],
		component: DéclarationRevenuIndépendant,
	} as const)
}
