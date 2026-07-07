import PourMonEntreprise from '@/pages/assistants/pour-mon-entreprise/index'
import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import { configPourMonEntreprise } from './simulationConfig'

export function pourMonEntrepriseConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		private: true,
		id: 'pour-mon-entreprise',
		pathId: 'assistants.pour-mon-entreprise.index',
		path: sitePaths.assistants['pour-mon-entreprise'].index,
		iframePath: 'pour-mon-entreprise',
		icône: '🏢',
		title: t(
			'pages.assistants.pour-mon-entreprise.title',
			'Assistants pour mon activité'
		),
		shortName: t(
			'pages.assistants.pour-mon-entreprise.title',
			'Assistants pour mon activité'
		),
		meta: {
			title: t(
				'pages.assistants.pour-mon-entreprise.title',
				'Assistants pour mon activité'
			),
			description: t(
				'pages.assistants.pour-mon-entreprise.meta.description',
				'Simulateurs et assistants adaptés à votre entreprise'
			),
		},
		tracking: {
			chapter1: 'assistants',
			chapter2: 'pour_mon_entreprise',
		},
		component: PourMonEntreprise,
		simulation: configPourMonEntreprise,
	} as const)
}
