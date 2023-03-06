import DéclarationChargeSocialeIndépendant from '.'
import { config } from '../../simulateurs/configs/config'
import { SimulatorsDataParams } from '../../simulateurs/configs/types'

export function déclarationChargesSocialesIndépendantConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'déclaration-charges-sociales-indépendant',
		pathId: 'assistants.déclaration-charges-sociales-indépendant',
		path: sitePaths.assistants['déclaration-charges-sociales-indépendant'],
		iframePath: 'déclaration-charges-sociales-indépendant',
		icône: '📑',
		tracking: {
			chapter1: 'gerer',
			chapter2: 'declaration_charges_sociales_independant',
		},
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
		shortName: t(
			'pages.gérer.declaration_charges_sociales_indépendant.shortname',
			'Détermination des charges sociales déductibles'
		),
		title: t(
			'pages.gérer.declaration_charges_sociales_indépendant.title',
			'Assistant à la détermination des charges sociales déductibles'
		),
		nextSteps: ['déclaration-revenu-indépendant'],
		component: DéclarationChargeSocialeIndépendant,
	} as const)
}
