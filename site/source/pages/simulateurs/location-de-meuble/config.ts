import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import AutoEntrepreneurPreview from '@/pages/simulateurs/_images/AutoEntrepreneurPreview.png'
import LocationDeMeublé from '@/pages/simulateurs/location-de-meuble/LocationDeMeuble'

export function locationDeMeubleConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'location-de-logement-meublé',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'location_de_logement_meublé',
		},
		icône: '🛖',
		beta: true,
		iframePath: 'simulateur-location-de-logement-meuble',
		pathId: 'simulateurs.location-de-logement-meublé',
		shortName: t(
			'pages.simulateurs.location-de-logement-meublé.shortname',
			'Location de meublé : Choix\u00A0du\u00A0régime\u00A0social'
		),
		title: t(
			'pages.simulateurs.location-de-logement-meublé.title',
			'Location de meublé : Choix du régime social'
		),
		path: sitePaths.simulateurs['location-de-logement-meublé'],
		component: LocationDeMeublé,
		meta: {
			title: t(
				'pages.simulateurs.location-de-logement-meublé.meta.titre',
				'Location de meublé : Choix du régime social'
			),
			ogTitle: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogTitle',
				'Location de meublé : Choix du régime social'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.meta.description',
				'Déterminez si vous devez vous affilier à la sécurité sociale pour vos revenus de location meublée et découvrez les régimes applicables.'
			),
			ogDescription: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogDescription',
				'Déterminez si vous devez vous affilier à la sécurité sociale pour vos revenus de location meublée et découvrez les régimes applicables.'
			),
			ogImage: AutoEntrepreneurPreview,
		},
	} as const)
}
