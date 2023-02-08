import IndépendantSimulation from '../Indépendant'
import { config } from '../configs/config'
import { configEurl } from '../configs/indépendant'
import { SimulatorsDataParams } from '../configs/types'
import RémunérationSASUPreview from './images/RémunérationSASUPreview.png'

export function eurlConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'eurl',
		tracking: {
			chapter2: 'statut_entreprise',
			chapter3: 'EURL',
		},
		icône: '📕',
		iframePath: 'simulateur-eurl',
		meta: {
			description: t(
				'pages.simulateurs.eurl.meta.description',
				'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
			),
			ogDescription: t(
				'pages.simulateurs.eurl.meta.ogDescription',
				'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
			),
			ogTitle: t(
				'pages.simulateurs.eurl.meta.ogTitle',
				"Rémunération du dirigeant d'EURL : un simulateur pour connaître votre salaire net"
			),
			title: t(
				'pages.simulateurs.eurl.meta.titre',
				'EURL : simulateur de revenus pour dirigeant'
			),
			ogImage: RémunérationSASUPreview,
		},
		pathId: 'simulateurs.eurl',
		shortName: t('pages.simulateurs.eurl.shortname', 'EURL'),
		title: t(
			'pages.simulateurs.eurl.title',
			"Simulateur de revenus pour dirigeant d'EURL"
		),
		nextSteps: [
			'déclaration-revenu-indépendant-beta',
			'is',
			'comparaison-statuts',
		],
		path: sitePaths.simulateurs.eurl,
		simulation: configEurl,
		component: IndépendantSimulation,
	} as const)
}
