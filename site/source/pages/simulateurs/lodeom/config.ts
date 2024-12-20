import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RéductionGénéraleSimulation from './Lodeom'
import { configRéductionGénérale } from './simulationConfig'

export function lodeomConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'lodeom',
		beta: true,
		tracking: 'lodeom',
		icône: '🏷️',
		iframePath: 'simulateur-lodeom',
		pathId: 'simulateurs.lodeom',
		shortName: t('pages.simulateurs.lodeom.shortname', 'Éxonération Lodeom'),
		title: t(
			'pages.simulateurs.lodeom.title',
			"Simulateur d'éxonération Lodeom"
		),
		meta: {
			title: t('pages.simulateurs.lodeom.meta.title', 'Éxonération Lodeom'),
			description: t(
				'pages.simulateurs.lodeom.meta.description',
				"Estimation du montant de l'exonération Lodeom. Cette exonération est applicable, sous conditions, aux salariés d'Outre-mer."
			),
		},
		nextSteps: ['salarié'],
		path: sitePaths.simulateurs.lodeom,
		simulation: configRéductionGénérale,
		component: RéductionGénéraleSimulation,
	} as const)
}
