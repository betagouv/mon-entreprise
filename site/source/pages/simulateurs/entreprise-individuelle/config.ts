import { EntrepriseIndividuelle } from '@/pages/simulateurs/entreprise-individuelle/EntrepriseIndividuelle'
import { SeoExplanations } from '@/pages/simulateurs/entreprise-individuelle/SeoExplanations'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RémunérationIndépendantPreview from '../indépendant/RémunérationIndépendantPreview.png'
import { entrepriseIndividuelleMetadata } from './metadata'
import { configEntrepriseIndividuelle } from './simulationConfig'

export function entrepriseIndividuelleConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...entrepriseIndividuelleMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.ei.meta.ogTitle',
				'Entreprise individuelle (EI) : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			description: t(
				'pages.simulateurs.ei.meta.ogDescription',
				"Grâce au simulateur de revenu pour entreprise individuelle développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
			),
			image: RémunérationIndépendantPreview,
		},
		simulation: configEntrepriseIndividuelle,
		component: EntrepriseIndividuelle,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
