import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ActivitéPartielle } from './ActivitéPartielle'
import ActivitéPartiellePreview from './ActivitéPartiellePreview.png'
import { activitéPartielleMetadata } from './metadata'
import { SeoExplanations } from './SeoExplanations'
import { configActivitéPartielle } from './simulationConfig'

export function activitéPartielleConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...activitéPartielleMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.activité-partielle.meta.ogTitle',
				"Simulateur activité partielle : découvrez l'impact sur le revenu net salarié et le coût total employeur."
			),
			description: t(
				'pages.simulateurs.activité-partielle.meta.ogDescription',
				"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG-CRDS)."
			),
			image: ActivitéPartiellePreview,
		},
		simulation: configActivitéPartielle,
		component: ActivitéPartielle,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'activite_partielle',
	} as const)
}
