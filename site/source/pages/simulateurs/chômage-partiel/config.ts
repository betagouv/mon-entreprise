import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ChômagePartielComponent, { SeoExplanations } from './ChômagePartiel'
import ChômagePartielPreview from './ChômagePartielPreview.png'
import { configChômagePartiel } from './simulationConfig'

export function chômagePartielConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'chômage-partiel',
		path: sitePaths.simulateurs['chômage-partiel'],
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'chomage_partiel',
		},
		pathId: 'simulateurs.chômage-partiel',
		icône: '📉',
		iframePath: 'simulateur-chomage-partiel',
		meta: {
			description: t(
				'pages.simulateurs.chômage-partiel.meta.description',
				"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
			),
			ogDescription: t(
				'pages.simulateurs.chômage-partiel.meta.ogDescription',
				"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG-CRDS)."
			),
			ogTitle: t(
				'pages.simulateurs.chômage-partiel.meta.ogTitle',
				"Simulateur chômage partiel : découvrez l'impact sur le revenu net salarié et le coût total employeur."
			),
			title: t(
				'pages.simulateurs.chômage-partiel.meta.titre',
				"Calcul de l'indemnité chômage partiel : le simulateur Urssaf"
			),
			ogImage: ChômagePartielPreview,
		},
		shortName: t(
			'pages.simulateurs.chômage-partiel.shortname',
			'Chômage partiel'
		),
		title: t(
			'pages.simulateurs.chômage-partiel.title',
			"Simulateur du calcul de l'indemnité chômage partiel"
		),
		nextSteps: ['salarié'],
		externalLinks: [embaucherGérerSalariés, nouvelEmployeur],
		simulation: configChômagePartiel,
		component: ChômagePartielComponent,
		seoExplanations: SeoExplanations,
	} as const)
}
