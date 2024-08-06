import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activité/CessationActivité'
import { configCessationActivité } from '@/pages/simulateurs/cessation-activité/simulationConfig'

import { config } from '../_configs/config'

export function cessationActivitéConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'cessation-activité',
		tracking: 'cessation_activité',
		icône: '🛑',
		iframePath: 'simulateur-cessation-activité',
		pathId: 'simulateurs.cessation-activité',
		shortName: t(
			'pages.simulateurs.cessation-activité.shortname',
			'Cessation d’activité'
		),
		title: t(
			'pages.simulateurs.cessation-activité.title',
			'Estimations de cotisations à devoir après cessation'
		),
		meta: {
			description: t(
				'pages.simulateurs.cessation-activité.meta.description',
				'Calculez vos cotisations à payer lors de la cessation de votre activité en tant qu’indépendant'
			),
			ogDescription: t(
				'pages.simulateurs.cessation-activité.meta.ogDescription',
				'Calculez vos cotisations à payer lors de la cessation de votre activité en tant qu’indépendant'
			),
			ogTitle: t(
				'pages.simulateurs.cessation-activité.meta.ogTitle',
				'Calculez vos cotisations à payer lors de la cessation de votre activité en tant qu’indépendant'
			),
			title: t(
				'pages.simulateurs.cessation-activité.meta.titre',
				'Indépendants : Estimations de cotisations à devoir après cessation'
			),
		},
		nextSteps: ['indépendant'],
		path: sitePaths.simulateurs['cessation-activité'],
		simulation: configCessationActivité,
		component: CessationActivitéSimulation,
	})
}
