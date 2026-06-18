import { config } from '@/pages/simulateurs/_configs/config'
import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

import CotisationMaladieFrontalierSuisse from './CotisationMaladieFrontalierSuisse'

export function cotisationMaladieFrontalierSuisseConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'cotisation-maladie-frontalier-suisse',
		beta: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cotisation_maladie_frontalier_suisse',
		},
		icône: '🇨🇭',
		iframePath: 'simulateur-cotisation-maladie-frontalier-suisse',
		pathId: 'simulateurs.cotisation-maladie-frontalier-suisse',
		shortName: t(
			'pages.simulateurs.cotisation-maladie-frontalier-suisse.shortname',
			'Cotisation maladie frontalier suisse'
		),
		title: t(
			'pages.simulateurs.cotisation-maladie-frontalier-suisse.title',
			'Cotisations maladie des travailleurs frontaliers en Suisse'
		),
		meta: {
			title: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.meta.title',
				'Cotisation maladie frontalier suisse'
			),
			description: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.meta.description',
				'Estimez le coût de votre cotisation maladie française en tant que travailleur frontalier en Suisse.'
			),
		},
		path: sitePaths.simulateurs['cotisation-maladie-frontalier-suisse'],
		component: CotisationMaladieFrontalierSuisse,
	} as const)
}
