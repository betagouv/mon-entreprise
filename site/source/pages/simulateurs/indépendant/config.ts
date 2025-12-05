import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import IndépendantSimulation from './Indépendant'
import { configIndépendant } from './simulationConfig'

export function indépendantConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'indépendant',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'independant',
		},
		icône: '🏃',
		iframePath: 'simulateur-independant',
		pathId: 'simulateurs.indépendant',
		shortName: t('pages.simulateurs.indépendant.shortname', 'Indépendant'),
		title: t(
			'pages.simulateurs.indépendant.title',
			'Simulateur de revenus pour indépendant'
		),
		meta: {
			title: t(
				'pages.simulateurs.indépendant.meta.title',
				'Indépendant : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.indépendant.meta.description',
				"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement"
			),
		},
		nextSteps: ['comparaison-statuts', 'is'],
		externalLinks: [premiersMoisUrssaf],
		conditionalExternalLinks: [
			serviceIndépendant,
			servicePLR,
			servicePAM,
			serviceExpertComptable,
		],
		path: sitePaths.simulateurs.indépendant,
		simulation: configIndépendant,
		component: IndépendantSimulation,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
