import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { AvertissementEIRL } from './Avertissement'
import { EIRL } from './EIRL'
import { eirlMetadata } from './metadata'
import { configEirl } from './simulationConfig'

export function eirlConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...eirlMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.eirl.meta.ogTitle',
				"Dirigeant d'EIRL : calculez rapidement votre revenu net à partir du CA et vice-versa"
			),
			description: t(
				'pages.simulateurs.eirl.meta.ogDescription',
				"Grâce au simulateur de revenu pour EIRL développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
			),
		},
		warning: AvertissementEIRL,
		simulation: configEirl,
		component: EIRL,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
