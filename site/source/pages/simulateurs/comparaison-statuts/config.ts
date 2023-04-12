import SchemeComparaisonPage from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configComparateurStatuts } from './simulationConfig'

export function comparaisonStatutsConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'comparaison-statuts',
		tracking: 'comparaison_statut',
		icône: '📊',
		pathId: 'simulateurs.comparaison',
		iframePath: 'comparaison-statuts',
		title: t(
			'pages.simulateurs.comparaison.title',
			'Comparateur de statut juridique'
		),
		beta: true,
		meta: {
			description: t(
				'pages.simulateurs.comparaison.meta.description',
				'Auto-entrepreneur, EI/EURL ou SASU ? Simulez les différences de revenu, retraite et indemnités maladie'
			),
			title: t(
				'pages.simulateurs.comparaison.meta.title',
				'Comparateur de statut juridique'
			),
		},
		shortName: t(
			'pages.simulateurs.comparaison.shortname',
			'Comparaison des statuts'
		),
		path: sitePaths.simulateurs.comparaison,
		simulation: configComparateurStatuts,
		component: SchemeComparaisonPage,
	} as const)
}
