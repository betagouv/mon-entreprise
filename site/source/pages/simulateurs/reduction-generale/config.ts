import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import { URSSAF } from '@/utils/logos'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RéductionGénéraleSimulation from './RéductionGénérale'
import { configRéductionGénérale } from './simulationConfig'

export function réductionGénéraleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'réduction-générale',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'reduction_generale',
		},
		icône: '🏷️',
		iframePath: 'simulateur-reduction-generale',
		pathId: 'simulateurs.réduction-générale',
		shortName: t(
			'pages.simulateurs.réduction-générale.shortname',
			'Réduction générale'
		),
		title: t(
			'pages.simulateurs.réduction-générale.title',
			'Simulateur de réduction générale des cotisations'
		),
		meta: {
			title: t(
				'pages.simulateurs.réduction-générale.meta.title',
				'Réduction générale'
			),
			description: t(
				'pages.simulateurs.réduction-générale.meta.description',
				'Estimation du montant de la réduction générale des cotisations patronales (RGCP). Cette réduction est applicable pour les salaires inférieurs à 1,6 fois le SMIC.'
			),
		},
		nextSteps: ['salarié'],
		externalLinks: [
			{
				url: 'https://www.urssaf.fr/accueil/employeur/beneficier-exonerations/reduction-generale-cotisation.html',
				title: t(
					'pages.simulateurs.réduction-générale.externalLinks.1.title',
					'La réduction générale des cotisations'
				),
				description: t(
					'pages.simulateurs.réduction-générale.externalLinks.1.description',
					'Calcul, déclaration, règles... Consultez le guide de l’Urssaf sur la réduction générale des cotisations.'
				),
				logo: URSSAF,
				ctaLabel: t(
					'pages.simulateurs.réduction-générale.externalLinks.1.ctaLabel',
					'Consulter le guide'
				),
				ariaLabel: t(
					'pages.simulateurs.réduction-générale.externalLinks.1.ariaLabel',
					'Consulter le guide sur urssaf.fr, nouvelle fenêtre'
				),
			},
			serviceEmployeur,
			embaucherGérerSalariés,
			nouvelEmployeur,
		],
		path: sitePaths.simulateurs['réduction-générale'],
		simulation: configRéductionGénérale,
		component: RéductionGénéraleSimulation,
	} as const)
}
