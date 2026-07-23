import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'

export function locationDeMeubleOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.location-de-logement-meublé.meta.ogTitle',
			'Location de meublé : Choix du régime social'
		),
		description: t(
			'pages.simulateurs.location-de-logement-meublé.meta.ogDescription',
			'Déterminez si vous devez vous affilier à la sécurité sociale pour vos revenus de location meublée et découvrez les régimes applicables.'
		),
		image: AutoEntrepreneurPreview,
	}
}
