import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'
import IndépendantSimulation from '../indépendant/Indépendant'
import { configEirl } from '../indépendant/simulationConfig'
import Avertissement from './Avertissement'

export function eirlConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'eirl',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'EIRL',
		},
		icône: '🚶',
		iframePath: 'simulateur-EIRL',
		meta: {
			description: t(
				'pages.simulateurs.eirl.meta.description',
				"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
			),
			ogDescription: t(
				'pages.simulateurs.eirl.meta.ogDescription',
				"Grâce au simulateur de revenu pour EIRL développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
			),
			ogTitle: t(
				'pages.simulateurs.eirl.meta.ogTitle',
				"Dirigeant d'EIRL : calculez rapidement votre revenu net à partir du CA et vice-versa"
			),
			title: t(
				'pages.simulateurs.eirl.meta.titre',
				'EIRL : simulateur de revenus pour dirigeant'
			),
			ogImage: AutoEntrepreneurPreview,
		},
		pathId: 'simulateurs.eirl',
		shortName: t('pages.simulateurs.eirl.shortname', 'EIRL'),
		title: t('pages.simulateurs.eirl.title', 'Simulateur de revenus pour EIRL'),
		warning: Avertissement,
		nextSteps: ['comparaison-statuts'],
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [
			serviceIndépendant,
			servicePLR,
			servicePAM,
			serviceExpertComptable,
		],
		path: sitePaths.simulateurs.eirl,
		simulation: configEirl,
		codesCatégorieJuridique: ['1000'],
		component: IndépendantSimulation,
	} as const)
}
