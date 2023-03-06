import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import AutoEntrepreneurPreview from '../images/AutoEntrepreneurPreview.png'
import AutoEntrepreneur, { SeoExplanations } from './AutoEntrepreneur'
import { configAutoEntrepreneur } from './simulationConfig'

export function autoEntrepreneurConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'auto-entrepreneur',
		tracking: 'auto_entrepreneur',
		icône: '🚶‍♂️',
		iframePath: 'simulateur-autoentrepreneur',
		meta: {
			description: t(
				'pages.simulateurs.auto-entrepreneur.meta.description',
				"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
			),
			ogDescription: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
				"Grâce au simulateur de revenu auto-entrepreneur développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
			),
			ogTitle: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
				'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			title: t(
				'pages.simulateurs.auto-entrepreneur.meta.titre',
				'Auto-entrepreneurs : simulateur de revenus'
			),
			ogImage: AutoEntrepreneurPreview,
		},
		pathId: 'simulateurs.auto-entrepreneur',
		shortName: t(
			'pages.simulateurs.auto-entrepreneur.shortname',
			'Auto-entrepreneur'
		),
		title: t(
			'pages.simulateurs.auto-entrepreneur.title',
			'Simulateur de revenus auto-entrepreneur'
		),
		nextSteps: ['indépendant', 'comparaison-statuts'],
		path: sitePaths.simulateurs['auto-entrepreneur'],
		simulation: configAutoEntrepreneur,
		component: AutoEntrepreneur,
		seoExplanations: SeoExplanations,
	} as const)
}
