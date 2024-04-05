import DéclarationChargeSocialeIndépendant from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

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
				'pages.assistants.declaration-charges-sociales-independant.meta.description',
				'Calculez le montant des cotisations et contributions sociales à reporter dans votre déclaration de revenu 2023'
			),
			title: t(
				'pages.assistants.declaration-charges-sociales-independant.meta.title',
				'Détermination des charges sociales déductibles'
			),
		},
		shortName: t(
			'pages.assistants.declaration-charges-sociales-independant.shortname',
			'Détermination des charges sociales déductibles'
		),
		title: t(
			'pages.assistants.declaration-charges-sociales-independant.title',
			'Assistant à la détermination des charges sociales déductibles'
		),
		component: DéclarationChargeSocialeIndépendant,
	} as const)
}
