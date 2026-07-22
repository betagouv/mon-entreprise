import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RémunérationSASUPreview from './RémunérationSASUPreview.png'
import { sasuMetadata } from './metadata'
import { SASUSimulation, SeoExplanations } from './SASU'
import { configSASU } from './simulationConfig'

export function sasuConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...sasuMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.sasu.meta.ogTitle',
				'Rémunération du dirigeant de SAS(U) : un simulateur pour connaître votre salaire net'
			),
			description: t(
				'pages.simulateurs.sasu.meta.ogDescription',
				'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
			),
			image: RémunérationSASUPreview,
		},
		simulation: configSASU,
		component: SASUSimulation,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
