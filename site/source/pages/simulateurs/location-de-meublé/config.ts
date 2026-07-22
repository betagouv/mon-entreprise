import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import LocationDeMeublé from '@/pages/simulateurs/location-de-meublé/LocationDeMeublé'

import { locationDeMeubleMetadata } from './metadata'

export function locationDeMeubleConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...locationDeMeubleMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogTitle',
				'Location de meublé : Choix du régime social'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogDescription',
				'Déterminez si vous devez vous affilier à la sécurité sociale pour vos revenus de location meublée et découvrez les régimes applicables.'
			),
		},
		component: LocationDeMeublé,
	} as const)
}
