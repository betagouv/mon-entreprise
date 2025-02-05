import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'
import AutoEntrepreneurPreview from '@/pages/simulateurs/_images/AutoEntrepreneurPreview.png'
import LocationDeMeublé from '@/pages/simulateurs/location-de-meublé/LocationDeMeublé'
import { configLocationDeMeublé } from '@/pages/simulateurs/location-de-meublé/simulationConfig'

export function locationDeMeubleConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'location-de-logement-meublé',
		tracking: 'location_de_logement_meublé',
		icône: '🛖',
		beta: true,
		iframePath: 'simulateur-location-de-logement-meuble',
		pathId: 'simulateurs.location-de-logement-meublé',
		shortName: t(
			'pages.simulateurs.location-de-logement-meublé.shortname',
			'Location de logement meublé'
		),
		title: t(
			'pages.simulateurs.location-de-logement-meublé.title',
			'Simulateur de revenu pour location de logement meublé'
		),
		path: sitePaths.simulateurs['location-de-logement-meublé'],
		simulation: configLocationDeMeublé,
		component: LocationDeMeublé,
		meta: {
			title: t(
				'pages.simulateurs.location-de-logement-meublé.meta.titre',
				'Simulateur de revenu pour location de logement meublé'
			),
			ogTitle: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogTitle',
				'Simulateur de revenu pour location de logement meublé'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.meta.description',
				'Ce simulateur permet de calculer les revenus générés par la location de logements meublés. Il aide les propriétaires à anticiper leurs gains et optimiser leur fiscalité dans ce cadre spécifique.'
			),
			ogDescription: t(
				'pages.simulateurs.location-de-logement-meublé.meta.ogDescription',
				'Ce simulateur permet de calculer les revenus générés par la location de logements meublés. Il aide les propriétaires à anticiper leurs gains et optimiser leur fiscalité dans ce cadre spécifique.'
			),
			ogImage: AutoEntrepreneurPreview,
		},
	} as const)
}
