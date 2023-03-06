import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ArtisteAuteur from './ArtisteAuteur'

export function artisteAuteurConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'artiste-auteur',
		path: sitePaths.simulateurs['artiste-auteur'],
		icône: '👩‍🎨',
		tracking: 'artiste-auteur',
		iframePath: 'simulateur-artiste-auteur',
		meta: {
			title: t(
				'pages.simulateurs.artiste-auteur.meta.title',
				'Artiste-auteur: calcul des cotisations Urssaf'
			),
			description: t(
				'pages.simulateurs.artiste-auteur.meta.description',
				"Estimez les cotisations sociales sur les droits d'auteur et sur le revenu BNC"
			),
			ogTitle: 'Artiste-auteur : estimez vos cotisations Urssaf',
			ogDescription:
				"Renseignez vos revenus (droits d'auteur et bnc) et découvrez immédiatement le montant des cotisations que vous aurez à payer sur l'année.",
		},
		pathId: 'simulateurs.artiste-auteur',
		title: t(
			'pages.simulateurs.artiste-auteur.title',
			'Simulateur de cotisations d’artiste-auteur'
		),
		shortName: t(
			'pages.simulateurs.artiste-auteur.shortname',
			'Artiste-auteur'
		),
		component: ArtisteAuteur,
	} as const)
}
