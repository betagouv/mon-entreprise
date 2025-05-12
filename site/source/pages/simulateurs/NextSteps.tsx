import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { useEngine } from '@/components/utils/EngineContext'
import { Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { GuideURSSAFCard } from '@/pages/simulateurs/cards/GuideURSSAFCard'
import { IframeIntegrationCard } from '@/pages/simulateurs/cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from '@/pages/simulateurs/cards/SimulatorRessourceCard'
import { useSitePaths } from '@/sitePaths'

import { AnnuaireEntreprises } from '../assistants/pour-mon-entreprise/AnnuaireEntreprises'
import { ExternalLink } from './_configs/types'
import ExternalLinkCard from './cards/ExternalLinkCard'

interface NextStepsProps {
	iframePath?: MergedSimulatorDataValues['iframePath']
	nextSteps: MergedSimulatorDataValues['nextSteps']
	externalLinks: MergedSimulatorDataValues['externalLinks']
}

export default function NextSteps({
	iframePath,
	nextSteps,
	externalLinks,
}: NextStepsProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const guidesUrssaf = guidesUrssafList.filter(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !guidesUrssaf.length && !nextSteps && !externalLinks) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3} role="list">
				<WhenAlreadyDefined dottedName="entreprise . SIREN">
					<GridItem>
						<AnnuaireEntreprises />
					</GridItem>
				</WhenAlreadyDefined>

				{nextSteps &&
					nextSteps.map((simulatorId) => (
						<GridItem key={simulatorId}>
							<SimulatorRessourceCard simulatorId={simulatorId} />
						</GridItem>
					))}

				{externalLinks &&
					externalLinks.map((externalLink: ExternalLink, index) => (
						<GridItem key={index}>
							<ExternalLinkCard externalLink={externalLink} />
						</GridItem>
					))}

				{guidesUrssaf &&
					language === 'fr' &&
					guidesUrssaf.map((guideUrssaf, index) => (
						<GridItem key={index}>
							<GuideURSSAFCard guideUrssaf={guideUrssaf} />
						</GridItem>
					))}

				{iframePath && (
					<GridItem>
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={absoluteSitePaths}
						/>
					</GridItem>
				)}
			</Grid>

			<Spacing lg />
		</section>
	)
}

type GridItemProps = {
	children: ReactNode
}
const GridItem = ({ children }: GridItemProps) => (
	<Grid item xs={12} sm={6} lg={4} role="listitem">
		{children}
	</Grid>
)

const guidesUrssafList = [
	// Pour les employeureuses
	{
		url: 'https://www.urssaf.fr/accueil/services/services-employeurs/service-employeur.html',
		title: 'Le service en ligne Employeur',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant = non',
				{ 'est non défini': 'artiste-auteur' },
			],
		},
	},
	{
		url: 'https://www.urssaf.fr/accueil/employeur/embaucher-gerer-salaries.html',
		title: 'Embaucher et gérer les salariés',
		description:
			'De l’embauche d’un salarié jusqu’à la fin de la relation de travail, l’Urssaf vous accompagne dans vos démarches et formalités à accomplir.',
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant = non',
				{ 'est non défini': 'artiste-auteur' },
			],
		},
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-employeurs/premiere-embauche.html',
		title: "Nouvel employeur : l'Urssaf vous accompagne",
		description:
			'Première embauche, un service de l’Urssaf pour guider les nouveaux employeurs dans leurs démarches.',
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant = non',
				{ 'est non défini': 'artiste-auteur' },
			],
		},
	},

	// Pour les indépendant⋅es et auto-entrepreneureuses
	{
		url: 'https://www.urssaf.fr/accueil/services/services-tiers-declarants/service-expert-comptable.html',
		title: 'Le service en ligne Expert-comptable',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule:
			"dirigeant . indépendant . PL . métier = 'expert-comptable'",
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/service-pam.html',
		title: 'Le service en ligne Praticien ou auxiliaire médical',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: 'dirigeant . indépendant . PL . PAMC',
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/service-plr.html',
		title: 'Le service en ligne Profession libérale réglementée',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant . indépendant . PL',
				'entreprise . activité . nature . libérale . réglementée',
				"dirigeant . indépendant . PL . métier != 'expert-comptable'",
				'dirigeant . indépendant . PL . PAMC = non',
			],
		},
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/service-acplnr.html',
		title:
			'Le service Artisan, Commerçant et Profession libérale non réglementée',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant . indépendant',
				'entreprise . activité . nature . libérale . réglementée = non',
			],
		},
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/mespremiersmois.html',
		title: 'Mes premiers mois avec l’Urssaf',
		description:
			'Un accompagnement tout au long des étapes clés de votre première année d’entrepreneuriat, pour réussir le lancement de votre entreprise.',
		associatedRule: {
			'une de ces conditions': [
				'dirigeant . auto-entrepreneur',
				'dirigeant . indépendant',
			],
		},
	},
]
