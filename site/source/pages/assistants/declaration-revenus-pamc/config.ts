import { servicePAM } from '@/external-links/servicePAM'
import { IMPOTS_GOUV, URSSAF } from '@/utils/logos'

import DéclarationRevenusPAMC from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'
import { configDéclarationRevenusPAMC } from './simulationConfig'

export function déclarationRevenusPAMCConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'déclaration-revenus-pamc',
		pathId: 'assistants.déclaration-revenus-pamc',
		path: sitePaths.assistants['déclaration-revenus-pamc'],
		iframePath: 'déclaration-revenus-pamc',
		tracking: {
			chapter1: 'assistants',
			chapter2: 'declaration_revenus_pamc',
		},
		component: DéclarationRevenusPAMC,
		icône: '📑',
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
		externalLinks: [
			{
				url: 'https://www.urssaf.fr/accueil/independant/declarer-vos-revenus/declaration-revenus-independants.html',
				title: t(
					'pages.assistants.declaration-revenus-pamc.externalLinks.1.title',
					'Tout savoir sur la déclaration sociale et fiscale des revenus des indépendants'
				),
				description: t(
					'pages.assistants.declaration-revenus-pamc.externalLinks.1.description',
					'Qui doit déclarer ses revenus d’indépendant et comment faire sa déclaration.'
				),
				logo: URSSAF,
			},
			{
				url: 'https://www.impots.gouv.fr/particulier/je-releve-du-regime-des-praticiens-et-auxiliaires-medicaux-conventionnes-pam-c-dans-le',
				title: t(
					'pages.assistants.declaration-revenus-pamc.externalLinks.2.title',
					'Je relève du régime des PAM-C dans le cadre de mon activité libérale'
				),
				description: t(
					'pages.assistants.declaration-revenus-pamc.externalLinks.2.description',
					'Modalités déclaratives et paiement des cotisations sociales pour les Praticiens et Auxiliaires Médicaux Conventionnés (PAM-C).'
				),
				logo: IMPOTS_GOUV,
			},
		],
		conditionalExternalLinks: [servicePAM],
		simulation: configDéclarationRevenusPAMC,
		autoloadLastSimulation: true,
	} as const)
}
