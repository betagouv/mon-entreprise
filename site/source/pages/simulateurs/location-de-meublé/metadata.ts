import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

export function locationDeMeubleMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'location-de-logement-meublé',
		pathId: 'simulateurs.location-de-logement-meublé',
		path: sitePaths.simulateurs['location-de-logement-meublé'],
		iframePath: 'simulateur-location-de-logement-meuble',
		icône: '🛖',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'location_de_logement_meublé',
		},
		title: t(
			'pages.simulateurs.location-de-logement-meublé.title',
			'Location de meublé : Choix du régime social'
		),
		shortName: t(
			'pages.simulateurs.location-de-logement-meublé.shortname',
			'Location de meublé : Choix du régime social'
		),
		meta: {
			title: t(
				'pages.simulateurs.location-de-logement-meublé.meta.titre',
				'Location de meublé : Choix du régime social'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.meta.description',
				'Déterminez si vous devez vous affilier à la sécurité sociale pour vos revenus de location meublée et découvrez les régimes applicables.'
			),
		},
	} as const
}
