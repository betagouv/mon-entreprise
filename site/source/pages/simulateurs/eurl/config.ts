import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RémunérationSASUPreview from '../_images/RémunérationSASUPreview.png'
import { EURL } from './EURL'
import { configEurl } from './simulationConfig'

export function eurlConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'eurl',
		tracking: {
			chapter1: 'simulateurs',
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
		path: sitePaths.simulateurs.eurl,
		simulation: configEurl,
		codesCatégorieJuridique: [
			'5410',
			'5415',
			'5422',
			'5426',
			'5430',
			'5431',
			'5432',
			'5442',
			'5443',
			'5451',
			'5453',
			'5454',
			'5455',
			'5458',
			'5459',
			'5460',
			'5499',
		],
		component: EURL,
	} as const)
}
