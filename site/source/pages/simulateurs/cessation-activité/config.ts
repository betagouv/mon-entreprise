import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activité/CessationActivité'
import { configCessationActivité } from '@/pages/simulateurs/cessation-activité/simulationConfig'
import { URSSAF } from '@/utils/logos'

import { config } from '../_configs/config'

export function cessationActivitéConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'cessation-activité',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cessation_activité',
		},
		icône: '📦',
		iframePath: 'simulateur-cessation-activité',
		pathId: 'simulateurs.cessation-activité',
		shortName: t(
			'pages.simulateurs.cessation-activité.shortname',
			'Cessation d’activité'
		),
		title: t(
			'pages.simulateurs.cessation-activité.title',
			'Simulateur de cessation d’activité'
		),
		meta: {
			description: t(
				'pages.simulateurs.cessation-activité.meta.description',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’indépendant.'
			),
			ogDescription: t(
				'pages.simulateurs.cessation-activité.meta.ogDescription',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’indépendant.'
			),
			ogTitle: t(
				'pages.simulateurs.cessation-activité.meta.ogTitle',
				'Simulateur de cessation d’activité'
			),
			title: t(
				'pages.simulateurs.cessation-activité.meta.titre',
				'Simulateur de cessation d’activité'
			),
		},
		nextSteps: ['indépendant'],
		externalLinks: [
			{
				url: 'https://www.urssaf.fr/accueil/services/services-independants/cessation-activite.html',
				title: t(
					'pages.simulateurs.cessation-activité.externalLinks.1.title',
					'Le service Cessation d’activité'
				),
				description: t(
					'pages.simulateurs.cessation-activité.externalLinks.1.description',
					'L’Urssaf vous accompagne à toutes les étapes clés de votre démarche de cessation d’activité.'
				),
				logo: URSSAF,
				ctaLabel: t('external-links.service.ctaLabel', 'Accéder au service'),
				ariaLabel: t(
					'external-links.service.ariaLabel',
					'Accéder au service sur urssaf.fr, nouvelle fenêtre'
				),
			},
		],
		path: sitePaths.simulateurs['cessation-activité'],
		simulation: configCessationActivité,
		component: CessationActivitéSimulation,
	} as const)
}
