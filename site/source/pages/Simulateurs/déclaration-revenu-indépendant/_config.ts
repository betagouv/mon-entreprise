import DéclarationChargeSocialeIndépendant from '../../gerer/declaration-charges-sociales-independant'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function déclarationRevenuIndépendantConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	// TODO: Delete "déclaration-revenu-indépendant" object when DRI will no longer be in beta
	return config({
		id: 'déclaration-revenu-indépendant',
		path: sitePaths.gérer.déclarationIndépendant.index,
		tracking: {
			chapter1: 'gerer',
			chapter2: 'declaration_charges_sociales_independant',
		},
		icône: '📑',
		meta: {
			description: t(
				'pages.gérer.declaration_charges_sociales_indépendant.meta.description',
				'Calculez le montant des cotisations et contributions sociales à reporter dans votre déclaration de revenu 2021'
			),
			title: t(
				'pages.gérer.declaration_charges_sociales_indépendant.meta.title',
				'Détermination des charges sociales déductibles'
			),
		},
		pathId: 'gérer.déclarationIndépendant.index',
		shortName: t(
			'pages.gérer.declaration_charges_sociales_indépendant.shortname',
			'Détermination des charges sociales déductibles'
		),
		iframePath: 'déclaration-revenu-indépendant',
		title: t(
			'pages.gérer.declaration_charges_sociales_indépendant.title',
			'Assistant à la détermination des charges sociales déductibles'
		),
		nextSteps: ['exonération-covid', 'déclaration-revenu-indépendant-beta'],
		component: DéclarationChargeSocialeIndépendant,
	} as const)
}
