import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'

export function entrepriseIndividuelleOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.ei.meta.ogTitle',
			'Entreprise individuelle (EI) : calculez rapidement votre revenu net à partir du CA et vice-versa'
		),
		description: t(
			'pages.simulateurs.ei.meta.ogDescription',
			"Grâce au simulateur de revenu pour entreprise individuelle développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
		),
		image: AutoEntrepreneurPreview,
	}
}
