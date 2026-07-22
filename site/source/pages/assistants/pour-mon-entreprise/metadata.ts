import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

export function pourMonEntrepriseMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'pour-mon-entreprise',
		pathId: 'assistants.pour-mon-entreprise.index',
		path: sitePaths.assistants['pour-mon-entreprise'].index,
		iframePath: 'pour-mon-entreprise',
		icône: '🏢',
		private: true,
		tracking: {
			chapter1: 'assistants',
			chapter2: 'pour_mon_entreprise',
		},
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
	} as const
}
