import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { Indépendant } from './Independant'
import { configIndépendant } from './simulationConfig'

export function independantConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'independant',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'independant',
		},
		icône: '🏃',
		iframePath: 'simulateur-independant',
		pathId: 'simulateurs.independant',
		shortName: t('pages.simulateurs.independant.shortname', 'Indépendant'),
		title: t(
			'pages.simulateurs.independant.title',
			'Simulateur de revenus pour independant'
		),
		meta: {
			title: t(
				'pages.simulateurs.independant.meta.title',
				'Indépendant : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.independant.meta.description',
				"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement"
			),
		},
		path: sitePaths.simulateurs.independant,
		simulation: configIndépendant,
		component: Indépendant,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
