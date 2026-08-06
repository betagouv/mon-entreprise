import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import AutoEntrepreneurPreview from './AutoEntrepreneurPreview.png'

export function autoEntrepreneurOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
			'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
		),
		description: t(
			'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
			"Prenez le contrôle de vos finances en tant qu'auto-entrepreneur ! Estimez instantanément votre revenu net après charges et découvrez comment gérer au mieux vos revenus. Notre simulateur, conçu avec l'expertise des professionnels, s'adapte à votre activité (secteur, chiffre d'affaires, exonération ACRE, etc.) pour vous aider à atteindre vos objectifs financiers."
		),
		image: AutoEntrepreneurPreview,
	}
}
