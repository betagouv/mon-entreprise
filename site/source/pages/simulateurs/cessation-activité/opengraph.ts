import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

export function cessationActivitéOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.cessation-activité.meta.ogTitle',
			'Simulateur de cessation d’activité'
		),
		description: t(
			'pages.simulateurs.cessation-activité.meta.ogDescription',
			'Estimez vos cotisations de l’année de cessation de votre activité en tant qu’indépendant.'
		),
	}
}
