import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { IndépendantPLSimulation } from '../indépendant/Indépendant'
import { configExpertComptable } from '../profession-libérale/simulationConfig'

export function expertComptableConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'expert-comptable',
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'expert_comptable',
		},
		icône: '🧮',
		iframePath: 'expert-comptable',
		pathId: 'simulateurs.profession-libérale.expert-comptable',
		shortName: t(
			'pages.simulateurs.expert-comptable.shortname',
			'Expert-Comptable'
		),
		title: t(
			'pages.simulateurs.expert-comptable.title',
			'Simulateur de revenus pour expert comptable et commissaire aux comptes en libéral'
		),
		meta: {
			title: t(
				'pages.simulateurs.expert-comptable.meta.title',
				'Expert-comptable : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.expert-comptable.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		path: sitePaths.simulateurs['profession-libérale']['expert-comptable'],
		simulation: configExpertComptable,
		component: IndépendantPLSimulation,
	} as const)
}
