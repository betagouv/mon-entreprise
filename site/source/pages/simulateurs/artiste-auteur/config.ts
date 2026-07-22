import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { ArtisteAuteur } from './ArtisteAuteur'
import { artisteAuteurMetadata } from './metadata'
import { configArtisteAuteur } from './simulationConfig'

export function artisteAuteurConfig(params: SimulatorsDataParams) {
	const { t } = params

	return config({
		...artisteAuteurMetadata(params),
		openGraph: {
			title: t(
				'pages.simulateurs.artiste-auteur.meta.ogTitle',
				'Artiste-auteur : estimez vos cotisations Urssaf'
			),
			description: t(
				'pages.simulateurs.artiste-auteur.meta.ogDescription',
				'Renseignez vos revenus (droits d’auteur et bnc) et découvrez immédiatement le montant des cotisations que vous aurez à payer sur l’année.'
			),
		},
		component: ArtisteAuteur,
		simulation: configArtisteAuteur,
	} as const)
}
