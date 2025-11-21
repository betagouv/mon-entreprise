import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import { EntrepriseIndividuelle } from '@/pages/simulateurs/entreprise-individuelle/EntrepriseIndividuelle'
import { SeoExplanations } from '@/pages/simulateurs/entreprise-individuelle/SeoExplanations'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'
import { configEntrepriseIndividuelle } from '../indépendant/simulationConfig'

export function entrepriseIndividuelleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'entreprise-individuelle',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'EI',
		},
		iframePath: 'simulateur-EI',
		icône: '🚶‍♀️',
		meta: {
			description: t(
				'pages.simulateurs.ei.meta.description',
				"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
			),
			ogDescription: t(
				'pages.simulateurs.ei.meta.ogDescription',
				"Grâce au simulateur de revenu pour entreprise individuelle développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
			),
			ogTitle: t(
				'pages.simulateurs.ei.meta.ogTitle',
				'Entreprise individuelle (EI) : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			title: t(
				'pages.simulateurs.ei.meta.titre',
				'Entreprise individuelle (EI) : simulateur de revenus'
			),
			ogImage: AutoEntrepreneurPreview,
		},
		pathId: 'simulateurs.entreprise-individuelle',
		shortName: t('pages.simulateurs.ei.shortname', 'Entreprise Individuelle'),
		title: t(
			'pages.simulateurs.ei.title',
			'Simulateur pour entreprise individuelle (EI)'
		),
		nextSteps: ['comparaison-statuts'],
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [
			serviceIndépendant,
			servicePLR,
			servicePAM,
			serviceExpertComptable,
		],
		path: sitePaths.simulateurs['entreprise-individuelle'],
		simulation: configEntrepriseIndividuelle,
		codesCatégorieJuridique: ['1000'],
		component: EntrepriseIndividuelle,
		seoExplanations: SeoExplanations,
	} as const)
}
