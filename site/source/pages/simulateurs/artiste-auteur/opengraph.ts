import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

export function artisteAuteurOpenGraph(t: TFunction): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.artiste-auteur.meta.ogTitle',
			'Artiste-auteur : estimez vos cotisations Urssaf'
		),
		description: t(
			'pages.simulateurs.artiste-auteur.meta.ogDescription',
			'Renseignez vos revenus (droits d’auteur et bnc) et découvrez immédiatement le montant des cotisations que vous aurez à payer sur l’année.'
		),
	}
}
