import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import RémunérationSASUPreview from '../_images/RémunérationSASUPreview.png'

export function sasuOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.sasu.meta.ogTitle',
			'Rémunération du dirigeant de SAS(U) : un simulateur pour connaître votre salaire net'
		),
		description: t(
			'pages.simulateurs.sasu.meta.ogDescription',
			'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
		),
		image: RémunérationSASUPreview,
	}
}
