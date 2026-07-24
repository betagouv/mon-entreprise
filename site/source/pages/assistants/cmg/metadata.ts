import { PageMetadataParams } from '@/pages/simulateurs/_configs/types'

export function CMGMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'cmg',
		pathId: 'assistants.cmg.index',
		path: sitePaths.assistants.cmg.index,
		iframePath: 'cmg',
		icône: '🧸',
		beta: true,
		hidden: true,
		tracking: {
			chapter1: 'assistants',
			chapter2: 'cmg',
		},
		title: t(
			'pages.assistants.cmg.title',
			'Simulateur de complément transitoire au CMG'
		),
		shortName: t(
			'pages.assistants.cmg.shortname',
			'Complément transitoire au CMG'
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
	} as const
}
