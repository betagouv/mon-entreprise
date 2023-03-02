import { config } from '@/pages/Simulateurs/configs/config'
import { SimulatorsDataParams } from '@/pages/Simulateurs/configs/types'

import PourMonEntreprise from '.'

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
			'Gérer mon activité'
		),
		shortName: t(
			'pages.assistants.pour-mon-entreprise.title',
			'Gérer mon activité'
		),
		meta: {
			title: t(
				'pages.assistants.pour-mon-entreprise.title',
				'Gérer mon activité'
			),
			description: t(
				'pages.assistants.pour-mon-entreprise.meta.description',
				'Simulateurs et assistants adaptés à votre entreprise'
			),
		},
		tracking: {},
		component: PourMonEntreprise as () => JSX.Element, // avoid types loop error
	} as const)
}
