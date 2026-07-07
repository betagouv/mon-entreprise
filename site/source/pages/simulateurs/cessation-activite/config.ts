import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activite/CessationActivite'
import { configCessationActivité } from '@/pages/simulateurs/cessation-activite/simulationConfig'

import { config } from '../_configs/config'

export function cessationActivitéConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'cessation-activite',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cessation_activité',
		},
		icône: '📦',
		iframePath: 'simulateur-cessation-activite',
		pathId: 'simulateurs.cessation-activite',
		shortName: t(
			'pages.simulateurs.cessation-activite.shortname',
			'Cessation d’activité'
		),
		title: t(
			'pages.simulateurs.cessation-activite.title',
			'Simulateur de cessation d’activité'
		),
		meta: {
			description: t(
				'pages.simulateurs.cessation-activite.meta.description',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’independant.'
			),
			ogDescription: t(
				'pages.simulateurs.cessation-activite.meta.ogDescription',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’independant.'
			),
			ogTitle: t(
				'pages.simulateurs.cessation-activite.meta.ogTitle',
				'Simulateur de cessation d’activité'
			),
			title: t(
				'pages.simulateurs.cessation-activite.meta.titre',
				'Simulateur de cessation d’activité'
			),
		},
		path: sitePaths.simulateurs['cessation-activite'],
		simulation: configCessationActivité,
		component: CessationActivitéSimulation,
	} as const)
}
