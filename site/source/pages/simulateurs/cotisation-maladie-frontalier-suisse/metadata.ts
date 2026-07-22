import { SimulatorsDataParams } from '@/pages/simulateurs/_configs/types'

export function cotisationMaladieFrontalierSuisseMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'cotisation-maladie-frontalier-suisse',
		pathId: 'simulateurs.cotisation-maladie-frontalier-suisse',
		path: sitePaths.simulateurs['cotisation-maladie-frontalier-suisse'],
		iframePath: 'simulateur-cotisation-maladie-frontalier-suisse',
		icône: '🇨🇭',
		beta: true,
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'cotisation_maladie_frontalier_suisse',
		},
		title: t(
			'pages.simulateurs.cotisation-maladie-frontalier-suisse.title',
			'Cotisations maladie des travailleuses et travailleurs frontalier·e·s en Suisse'
		),
		shortName: t(
			'pages.simulateurs.cotisation-maladie-frontalier-suisse.shortname',
			'Cotisation maladie frontalier suisse'
		),
		meta: {
			title: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.meta.title',
				'Cotisation maladie frontalier suisse'
			),
			description: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.meta.description',
				'Estimez le coût de votre cotisation maladie française en tant que travailleur·euse frontalier·ère en Suisse.'
			),
		},
	} as const
}
