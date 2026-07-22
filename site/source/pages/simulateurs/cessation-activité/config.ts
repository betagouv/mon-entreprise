import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activité/CessationActivité'
import { configCessationActivité } from '@/pages/simulateurs/cessation-activité/simulationConfig'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { cessationActivitéMetadata } from './metadata'

export function cessationActivitéConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...cessationActivitéMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.cessation-activité.meta.ogTitle',
				'Simulateur de cessation d’activité'
			),
			description: t(
				'pages.simulateurs.cessation-activité.meta.ogDescription',
				'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’indépendant.'
			),
		},
		simulation: configCessationActivité,
		component: CessationActivitéSimulation,
	} as const)
}
