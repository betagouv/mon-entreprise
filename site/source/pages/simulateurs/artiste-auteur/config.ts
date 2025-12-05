import { URSSAF } from '@/utils/logos'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import ArtisteAuteur from './ArtisteAuteur'
import { configArtisteAuteur } from './simulationConfig'

export function artisteAuteurConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'artiste-auteur',
		path: sitePaths.simulateurs['artiste-auteur'],
		icône: '👩‍🎨',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'artiste-auteur',
		},
		iframePath: 'simulateur-artiste-auteur',
		meta: {
			title: t(
				'pages.simulateurs.artiste-auteur.meta.title',
				'Artiste-auteur: calcul des cotisations Urssaf'
			),
			description: t(
				'pages.simulateurs.artiste-auteur.meta.description',
				'Estimez les cotisations sociales sur les droits d’auteur et sur le revenu BNC'
			),
			ogTitle: t(
				'pages.simulateurs.artiste-auteur.meta.ogTitle',
				'Artiste-auteur : estimez vos cotisations Urssaf'
			),
			ogDescription: t(
				'pages.simulateurs.artiste-auteur.meta.ogDescription',
				'Renseignez vos revenus (droits d’auteur et bnc) et découvrez immédiatement le montant des cotisations que vous aurez à payer sur l’année.'
			),
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
		externalLinks: [
			{
				url: 'https://www.urssaf.fr/accueil/services/services-artisteauteur-diffuseur/service-artiste-auteur.html',
				title: t(
					'pages.simulateurs.artiste-auteur.externalLinks.1.title',
					'Le service en ligne Artiste-auteur'
				),
				description: t(
					'external-links.service.description',
					'L’Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.'
				),
				logo: URSSAF,
				ctaLabel: t('external-links.service.ctaLabel', 'Accéder au service'),
				ariaLabel: t(
					'external-links.service.ariaLabel',
					'Accéder au service sur urssaf.fr, nouvelle fenêtre'
				),
			},
		],
		codesCatégorieJuridique: ['1000'],
		component: ArtisteAuteur,
		simulation: configArtisteAuteur,
	} as const)
}
