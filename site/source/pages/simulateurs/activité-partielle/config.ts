import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ActivitéPartielleComponent from './ActivitéPartielle'
import ActivitéPartiellePreview from './ActivitéPartiellePreview.png'
import { SeoExplanations } from './SeoExplanations'
import { configActivitéPartielle } from './simulationConfig'

export function activitéPartielleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'activité-partielle',
		path: sitePaths.simulateurs['activité-partielle'],
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'chomage_partiel',
		},
		pathId: 'simulateurs.activité-partielle',
		icône: '📉',
		iframePath: 'simulateur-chomage-partiel',
		meta: {
			description: t(
				'pages.simulateurs.activité-partielle.meta.description',
				"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
			),
			ogDescription: t(
				'pages.simulateurs.activité-partielle.meta.ogDescription',
				"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG-CRDS)."
			),
			ogTitle: t(
				'pages.simulateurs.activité-partielle.meta.ogTitle',
				"Simulateur activité partielle : découvrez l'impact sur le revenu net salarié et le coût total employeur."
			),
			title: t(
				'pages.simulateurs.activité-partielle.meta.titre',
				"Calcul de l'indemnité activité partielle : le simulateur Urssaf"
			),
			ogImage: ActivitéPartiellePreview,
		},
		shortName: t(
			'pages.simulateurs.activité-partielle.shortname',
			'Activité partielle'
		),
		title: t(
			'pages.simulateurs.activité-partielle.title',
			"Simulateur du calcul de l'indemnité activité partielle"
		),
		nextSteps: ['salarié'],
		externalLinks: [serviceEmployeur, embaucherGérerSalariés, nouvelEmployeur],
		simulation: configActivitéPartielle,
		component: ActivitéPartielleComponent,
		seoExplanations: SeoExplanations,
	} as const)
}
