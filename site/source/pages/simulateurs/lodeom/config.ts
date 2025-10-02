import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import LodeomSimulation from './Lodeom'
import { configLodeom } from './simulationConfig'

export function lodeomConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'lodeom',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'lodeom',
		},
		icône: '🏷️',
		iframePath: 'simulateur-lodeom',
		pathId: 'simulateurs.lodeom',
		shortName: t('pages.simulateurs.lodeom.shortname', 'Exonération Lodeom'),
		title: t(
			'pages.simulateurs.lodeom.title',
			"Simulateur d'exonération Lodeom"
		),
		meta: {
			title: t('pages.simulateurs.lodeom.meta.title', 'Exonération Lodeom'),
			description: t(
				'pages.simulateurs.lodeom.meta.description',
				"Estimation du montant de l'exonération Lodeom. Cette exonération est applicable, sous conditions, aux salariés d'Outre-mer."
			),
		},
		nextSteps: ['salarié'],
		externalLinks: [embaucherGérerSalariés, nouvelEmployeur],
		path: sitePaths.simulateurs.lodeom,
		simulation: configLodeom,
		component: LodeomSimulation,
	} as const)
}
