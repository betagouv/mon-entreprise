import DéclarationChargeSocialeIndépendant from '../../gerer/declaration-charges-sociales-independant'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function déclarationChargesSocialesIndépendantConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'déclaration-charges-sociales-indépendant',
		path: sitePaths.gérer['déclaration-charges-sociales-indépendant'],
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
		pathId: 'gérer.déclaration-charges-sociales-indépendant',
		shortName: t(
			'pages.gérer.declaration_charges_sociales_indépendant.shortname',
			'Détermination des charges sociales déductibles'
		),
		iframePath: 'déclaration-charges-sociales-indépendant',
		title: t(
			'pages.gérer.declaration_charges_sociales_indépendant.title',
			'Assistant à la détermination des charges sociales déductibles'
		),
		nextSteps: ['exonération-covid', 'déclaration-revenu-indépendant-beta'],
		component: DéclarationChargeSocialeIndépendant,
	} as const)
}
