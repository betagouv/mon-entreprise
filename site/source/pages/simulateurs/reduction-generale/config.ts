import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RéductionGénéraleSimulation from './RéductionGénérale'
import { configRéductionGénérale } from './simulationConfig'

export function réductionGénéraleConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'réduction-générale',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'reduction_generale',
		},
		icône: '🏷️',
		iframePath: 'simulateur-reduction-generale',
		pathId: 'simulateurs.réduction-générale',
		shortName: t(
			'pages.simulateurs.réduction-générale.shortname',
			'Réduction générale'
		),
		title: t(
			'pages.simulateurs.réduction-générale.title',
			'Simulateur de réduction générale des cotisations'
		),
		meta: {
			title: t(
				'pages.simulateurs.réduction-générale.meta.title',
				'Réduction générale'
			),
			description: t(
				'pages.simulateurs.réduction-générale.meta.description',
				'Estimation du montant de la réduction générale des cotisations patronales (RGCP). Cette réduction est applicable pour les salaires inférieurs à 1,6 fois le SMIC.'
			),
		},
		path: sitePaths.simulateurs['réduction-générale'],
		simulation: configRéductionGénérale,
		component: RéductionGénéraleSimulation,
	} as const)
}
