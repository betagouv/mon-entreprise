import SchemeComparaisonPage from '.'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
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
				'Auto-entrepreneur, indépendant ou dirigeant de SASU ? Avec ce comparatif, trouvez le régime qui vous correspond le mieux'
			),
			title: t(
				'pages.simulateurs.comparaison.meta.title',
				"Création d'entreprise : le comparatif des régimes sociaux"
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
