import { SeoExplanations } from '@/pages/simulateurs/auto-entrepreneur/SeoExplanations'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'
import AutoEntrepreneur from './AutoEntrepreneur'
import { configAutoEntrepreneur } from './simulationConfig'

export function autoEntrepreneurConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'auto-entrepreneur',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'auto_entrepreneur',
		},
		icône: '🚶‍♂️',
		iframePath: 'simulateur-autoentrepreneur',
		meta: {
			description: t(
				'pages.simulateurs.auto-entrepreneur.meta.description',
				'Calculez votre revenu net après cotisations et impôts en tenant compte de toutes les options, y compris ACRE et prélèvement libératoire.'
			),
			ogDescription: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
				"Prenez le contrôle de vos finances en tant qu'auto-entrepreneur ! Estimez instantanément votre revenu net après charges et découvrez comment gérer au mieux vos revenus. Notre simulateur, conçu avec l'expertise des professionnels, s'adapte à votre activité (secteur, chiffre d'affaires, exonération ACRE, etc.) pour vous aider à atteindre vos objectifs financiers."
			),
			ogTitle: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
				'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			title: t(
				'pages.simulateurs.auto-entrepreneur.meta.titre',
				'Auto-entrepreneurs : simulateur de revenus'
			),
			ogImage: AutoEntrepreneurPreview,
		},
		pathId: 'simulateurs.auto-entrepreneur',
		shortName: t(
			'pages.simulateurs.auto-entrepreneur.shortname',
			'Auto-entrepreneur'
		),
		title: t(
			'pages.simulateurs.auto-entrepreneur.title',
			'Simulateur de revenus auto-entrepreneur'
		),
		path: sitePaths.simulateurs['auto-entrepreneur'],
		simulation: configAutoEntrepreneur,
		codesCatégorieJuridique: ['1000'],
		component: AutoEntrepreneur,
		seoExplanations: SeoExplanations,
	} as const)
}
