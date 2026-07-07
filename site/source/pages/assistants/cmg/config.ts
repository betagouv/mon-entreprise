import CMG from '@/pages/assistants/cmg/index'
import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

export function CMGConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'cmg',
		beta: true,
		hidden: true,
		pathId: 'assistants.cmg.index',
		path: sitePaths.assistants.cmg.index,
		iframePath: 'cmg',
		disableIframeFeedback: true,
		tracking: {
			chapter1: 'assistants',
			chapter2: 'cmg',
		},
		component: CMG,
		icône: '🧸',
		shortName: t(
			'pages.assistants.cmg.shortname',
			'Complément transitoire au CMG'
		),
		title: t(
			'pages.assistants.cmg.title',
			'Simulateur de complément transitoire au CMG'
		),
		meta: {
			title: t(
				'pages.assistants.cmg.meta.titre',
				'Simulateur de complément transitoire au CMG'
			),
			description: t(
				'pages.assistants.cmg.meta.description',
				'Ce simulateur permet d’estimer le montant du complément transitoire au CMG Rémunération.'
			),
		},
	} as const)
}
