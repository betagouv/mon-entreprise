import DéclarationRevenusPAMC from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

export function déclarationRevenusPAMCConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'déclaration-revenus-pamc',
		pathId: 'assistants.déclaration-revenus-pamc',
		path: sitePaths.assistants['déclaration-revenus-pamc'],
		iframePath: 'déclaration-revenus-pamc',
		icône: '📑',
		tracking: {
			chapter1: 'assistant',
			chapter2: 'declaration_revenus_pamc',
		},
		meta: {
			description: t(
				'pages.assistants.declaration-revenus-pamc.meta.description',
				'Calculez les montants de vos revenus à reporter dans votre déclaration de revenus.'
			),
			title: t(
				'pages.assistants.declaration-revenus-pamc.meta.title',
				'Déclaration de revenus des PAMC'
			),
		},
		shortName: t(
			'pages.assistants.declaration-revenus-pamc.shortname',
			'Assistant à la déclaration de revenus des PAMC'
		),
		title: t(
			'pages.assistants.declaration-revenus-pamc.title',
			'Assistant à la déclaration de revenus pour les PAMC'
		),
		component: DéclarationRevenusPAMC,
	} as const)
}
