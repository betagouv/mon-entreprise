import { Trans } from 'react-i18next'

import { Body, H2, Li, Strong, Ul } from '@/design-system'

import ChoixDuStatut from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'
import { configChoixDuStatut } from './simulationConfig'

export function choixStatutJuridiqueConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'choix-statut',
		pathId: 'assistants.choix-du-statut.index',
		path: sitePaths.assistants['choix-du-statut'].index,
		iframePath: 'choix-statut-juridique',
		icône: '💡',
		tracking: {
			chapter1: 'assistants',
			chapter2: 'choix_du_statut',
		},
		meta: {
			title: t(
				'pages.assistants.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.assistants.choix-statut.meta.description',
				"SAS, EURL, EI, auto-entrepreneur…  Ce simulateur vous aide à choisir le statut juridique le plus adapté à votre projet d'entreprise."
			),
		},
		title: t('pages.assistants.choix-statut.title', 'Choisir votre statut'),
		shortName: t('pages.assistants.choix-statut.shortname', 'Choix du statut'),
		component: ChoixDuStatut,
		seoExplanations: SeoExplanations,
		simulation: configChoixDuStatut,
		autoloadLastSimulation: true,
	} as const)
}

function SeoExplanations() {
	return (
		<Trans i18nKey="pages.assistants.choix-statut.seo explanation">
			<H2>Pourquoi le choix du statut est-il essentiel ?</H2>
			<Body>
				Votre statut juridique détermine la structure de votre entreprise, ses
				obligations fiscales et sociales, ainsi que votre responsabilité en tant
				que dirigeant. Il peut influencer directement votre rentabilité, votre
				couverture sociale, vos possibilités de financement, et bien plus
				encore.
			</Body>
			<H2>Comment choisir le bon statut ?</H2>
			<Body>
				Notre assistant au choix du statut est conçu pour simplifier ce
				processus complexe. Il vous posera des questions simples sur votre
				entreprise, vos objectifs et votre situation personnelle. Il vous
				permettra de selectionner le statut le mieux adaptés à votre situation.
			</Body>
			<Body>Les avantages de notre assistant :</Body>
			<Ul>
				<Li>
					<Strong>Personnalisé :</Strong> Nos recommandations sont adaptées à
					votre situation spécifique.
				</Li>
				<Li>
					<Strong>Informé :</Strong> Nous actualisons régulièrement nos
					informations pour refléter les dernières réglementations et lois
					fiscales.
				</Li>
				<Li>
					<Strong>Simplicité :</Strong> Vous n'avez pas besoin d'être un expert
					juridique. Notre assistant rend le processus aussi simple que
					possible.
				</Li>
				<Li>
					<Strong>Confiance :</Strong> Nos recommandations reposent sur une
					analyse approfondie et impartiale.
				</Li>
			</Ul>
		</Trans>
	)
}
