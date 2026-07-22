import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RémunérationIndépendantPreview from '../indépendant/RémunérationIndépendantPreview.png'
import { EURL } from './EURL'
import { eurlMetadata } from './metadata'
import { configEurl } from './simulationConfig'

export function eurlConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...eurlMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.eurl.meta.ogTitle',
				"Rémunération du dirigeant d'EURL : un simulateur pour connaître votre salaire net"
			),
			description: t(
				'pages.simulateurs.eurl.meta.ogDescription',
				'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
			),
			image: RémunérationIndépendantPreview,
		},
		simulation: configEurl,
		component: EURL,
	} as const)
}
