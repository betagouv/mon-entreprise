import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import IndépendantSimulation from './Indépendant'
import { configIndépendant } from './simulationConfig'

export function indépendantConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'indépendant',
		tracking: 'independant',
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
		nextSteps: [
			'déclaration-revenu-indépendant-beta',
			'comparaison-statuts',
			'is',
		],
		path: sitePaths.simulateurs.indépendant,
		simulation: configIndépendant,
		component: IndépendantSimulation,
	} as const)
}
