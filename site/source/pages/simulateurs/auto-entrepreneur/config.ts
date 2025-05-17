import { SeoExplanations } from '@/pages/simulateurs/auto-entrepreneur/SeoExplanations'
import { URSSAF } from '@/utils/logos'

import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import AutoEntrepreneurPreview from '../_images/AutoEntrepreneurPreview.png'
import AutoEntrepreneur from './AutoEntrepreneur'
import { configAutoEntrepreneur } from './simulationConfig'

export function autoEntrepreneurConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'auto-entrepreneur',
		tracking: 'auto_entrepreneur',
		icône: '🚶‍♂️',
		iframePath: 'simulateur-autoentrepreneur',
		meta: {
			description: t(
				'pages.simulateurs.auto-entrepreneur.meta.description',
				'Calculez votre revenu net après cotisations et impôts en tenant compte de toutes les options, y compris ACRE et prélèvement libératoire.'
			),
			ogDescription: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
				"Prenez le contrôle de vos finances en tant qu'auto-entrepreneur ! Estimez instantanément votre revenu net après charges et découvrez comment gérer au mieux vos revenus. Notre simulateur, conçu avec l'expertise des professionnels, s'adapte à votre activité (secteur, chiffre d'affaires, exonération ACRE, etc.) pour vous aider à atteindre vos objectifs financiers."
			),
			ogTitle: t(
				'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
				'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
			),
			title: t(
				'pages.simulateurs.auto-entrepreneur.meta.titre',
				'Auto-entrepreneurs : simulateur de revenus'
			),
			ogImage: AutoEntrepreneurPreview,
		},
		pathId: 'simulateurs.auto-entrepreneur',
		shortName: t(
			'pages.simulateurs.auto-entrepreneur.shortname',
			'Auto-entrepreneur'
		),
		title: t(
			'pages.simulateurs.auto-entrepreneur.title',
			'Simulateur de revenus auto-entrepreneur'
		),
		nextSteps: ['indépendant', 'comparaison-statuts'],
		externalLinks: [
			{
				url: 'https://autoentrepreneur.urssaf.fr',
				title: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.1.title',
					'Site officiel des auto-entrepreneurs'
				),
				description: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.1.description',
					'Vous pourrez effectuer votre déclaration de chiffre d’affaires, payer vos cotisations, et plus largement trouver toutes les informations relatives au statut d’auto-entrepreneur.'
				),
				ctaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.1.ctaLabel',
					'Visiter le site'
				),
				ariaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.1.ariaLabel',
					'Visiter le site auto-entrepreneur.urssaf.fr, nouvelle fenêtre.'
				),
			},
			{
				url: 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/guide-officiel.html',
				title: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.2.title',
					'Guides pratiques de l’auto-entrepreneur'
				),
				description: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.2.description',
					'Les guides de l’Urssaf dédiés aux auto-entrepreneurs et auto-entrepreneuses.'
				),
				logo: URSSAF,
				ctaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.2.ctaLabel',
					'Voir les guides'
				),
				ariaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.2.ariaLabel',
					'Voir les guides sur auto-entrepreneur.urssaf.fr, nouvelle fenêtre.'
				),
			},
			{
				url: 'https://www.urssaf.fr/accueil/services/services-independants/service-autoentrepreneur.html',
				title: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.3.title',
					'Le service en ligne Auto-entrepreneur'
				),
				description: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.3.description',
					'L’Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.'
				),
				logo: URSSAF,
				ctaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.3.ctaLabel',
					'Accéder au service'
				),
				ariaLabel: t(
					'pages.simulateurs.auto-entrepreneur.externalLinks.3.ariaLabel',
					'Accéder au service sur urssaf.fr, nouvelle fenêtre'
				),
			},
		],
		path: sitePaths.simulateurs['auto-entrepreneur'],
		simulation: configAutoEntrepreneur,
		codesCatégorieJuridique: ['1000'],
		component: AutoEntrepreneur,
		seoExplanations: SeoExplanations,
	} as const)
}
