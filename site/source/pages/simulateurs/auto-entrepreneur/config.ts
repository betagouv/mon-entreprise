import { SeoExplanations } from '@/pages/simulateurs/auto-entrepreneur/SeoExplanations'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AutoEntrepreneur } from './AutoEntrepreneur'
import { autoEntrepreneurMetadata } from './metadata'
import AutoEntrepreneurPreview from './AutoEntrepreneurPreview.png'
import { configAutoEntrepreneur } from './simulationConfig'

export function autoEntrepreneurConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...autoEntrepreneurMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
				'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			description: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
				"Prenez le contrôle de vos finances en tant qu'auto-entrepreneur ! Estimez instantanément votre revenu net après charges et découvrez comment gérer au mieux vos revenus. Notre simulateur, conçu avec l'expertise des professionnels, s'adapte à votre activité (secteur, chiffre d'affaires, exonération ACRE, etc.) pour vous aider à atteindre vos objectifs financiers."
			),
			image: AutoEntrepreneurPreview,
		},
		simulation: configAutoEntrepreneur,
		component: AutoEntrepreneur,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'micro_entrepreneur',
	} as const)
}
