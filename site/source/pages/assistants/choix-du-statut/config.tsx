import { Trans } from 'react-i18next'

import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import ChoixDuStatut from '.'
import { config } from '../../simulateurs/_configs/config'
import { SimulatorsDataParams } from '../../simulateurs/_configs/types'

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
		beta: true,
		tracking: {
			chapter1: 'assistant',
			chapter2: 'choix_du_statut',
		},
		meta: {
			title: t(
				'pages.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.choix-statut.meta.description',
				"SAS, EURL, EI, auto-entrepreneur...  Ce simulateur vous aide à choisir le statut juridique le plus adapté à votre projet d'entreprise."
			),
		},
		title: t('pages.choix-statut.title', 'Choisir votre statut'),
		shortName: t('pages.choix-statut.shortname', 'Choix du statut'),
		component: ChoixDuStatut,
		seoExplanations: SeoExplanations,
		simulation: {
			situation: {
				'entreprise . catégorie juridique . remplacements': 'non',
				'entreprise . date de création': 'date',
				salarié: 'non',
			},
		},
		autoloadLastSimulation: true,
		nextSteps: ['coût-création-entreprise'],
	} as const)
}

function SeoExplanations() {
	return (
		<Trans i18nKey="pages.choix-statut.seo explanation">
			<H2>Pourquoi le choix du statut est-il essentiel ?</H2>
			<Body>
				Votre statut juridique détermine la structure de votre entreprise, ses
				obligations fiscales et sociales, ainsi que votre responsabilité en tant
				que dirigeant. Il peut influencer directement votre rentabilité, votre
				couverture sociale, vos possibilités de financement, et bien plus
				encore.
			</Body>
			<H2>Quelles formalités pour un changement de statut réussi ?</H2>
                                 <Body>
                                   Changer le statut juridique de votre entreprise est une étape importante qui peut influencer votre structure d'entreprise, vos obligations fiscales et sociales, ainsi que votre responsabilité en tant que dirigeant. Que ce soit pour une adaptation à la croissance de votre activité, pour une optimisation fiscale, ou pour une meilleure adéquation avec vos objectifs commerciaux, ce choix stratégique mérite une attention particulière.
                                 </Body>
                                 <Body>
                                   Comprendre les nuances et les implications de chaque statut est crucial. Chaque option, de l'auto-entrepreneur à la SARL, en passant par la SAS, présente des avantages et des inconvénients spécifiques. Il est essentiel de peser ces facteurs par rapport à votre situation actuelle et à vos plans futurs.
                                 </Body>
                                 <Body>
                                   Nous vous encourageons à vous informer en profondeur sur les différentes options de statut juridique et sur les processus de transition associés. La prise en compte des dernières réglementations et lois fiscales est également importante pour faire un choix éclairé. Notre assistant interactif est conçu pour faciliter cette exploration en vous posant des questions sur votre entreprise, vos objectifs et votre situation personnelle, et ainsi vous aider à identifier le statut le plus adapté à votre contexte.
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
