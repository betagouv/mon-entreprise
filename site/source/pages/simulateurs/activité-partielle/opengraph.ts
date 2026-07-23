import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import ActivitéPartiellePreview from './ActivitéPartiellePreview.png'

export function activitéPartielleOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.activité-partielle.meta.ogTitle',
			"Simulateur activité partielle : découvrez l'impact sur le revenu net salarié et le coût total employeur."
		),
		description: t(
			'pages.simulateurs.activité-partielle.meta.ogDescription',
			"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG-CRDS)."
		),
		image: ActivitéPartiellePreview,
	}
}
