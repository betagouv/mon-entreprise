import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { useEngine } from '@/components/utils/EngineContext'
import { Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { GuideURSSAFCard } from '@/pages/simulateurs/cards/GuideURSSAFCard'
import { IframeIntegrationCard } from '@/pages/simulateurs/cards/IframeIntegrationCard'
import { SimulatorRessourceCard } from '@/pages/simulateurs/cards/SimulatorRessourceCard'
import { useSitePaths } from '@/sitePaths'

import { AnnuaireEntreprises } from '../assistants/pour-mon-entreprise/AnnuaireEntreprises'
import { AutoEntrepreneurCard } from '../assistants/pour-mon-entreprise/AutoEntrepeneurCard'
import { CodeDuTravailNumeriqueCard } from '../assistants/pour-mon-entreprise/CodeDuTravailNumeriqueCard'
import { ReductionGeneraleCard } from '../assistants/pour-mon-entreprise/ReductionGeneraleCard'

interface NextStepsProps {
	iframePath?: MergedSimulatorDataValues['iframePath']
	nextSteps: MergedSimulatorDataValues['nextSteps']
}

export function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const { key } = useCurrentSimulatorData()
	const guidesUrssaf = guidesUrssafList.filter(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !guidesUrssaf.length && !nextSteps) {
		return null
	}

	return (
		<section className="print-hidden">
			<H2>
				<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3} role="list">
				<Condition expression="entreprise . catégorie juridique . EI . auto-entrepreneur = oui">
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<AutoEntrepreneurCard />
					</Grid>
				</Condition>

				<WhenAlreadyDefined dottedName="entreprise . SIREN">
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<AnnuaireEntreprises />
					</Grid>
				</WhenAlreadyDefined>

				{nextSteps &&
					nextSteps.map((simulatorId) => (
						<Grid item xs={12} sm={6} lg={4} key={simulatorId} role="listitem">
							<SimulatorRessourceCard simulatorId={simulatorId} />
						</Grid>
					))}

				{key === 'réduction-générale' && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<ReductionGeneraleCard />
					</Grid>
				)}

				{guidesUrssaf &&
					language === 'fr' &&
					guidesUrssaf.map((guideUrssaf, index) => (
						<Grid item xs={12} sm={6} lg={4} role="listitem" key={index}>
							<GuideURSSAFCard guideUrssaf={guideUrssaf} />
						</Grid>
					))}

				{key === 'location-de-logement-meublé' && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<GuideURSSAFCard
							guideUrssaf={{
								url: 'https://www.urssaf.fr/accueil/services/economie-collaborative.html',
								title: 'Le guide Économie collaborative de l’Urssaf',
								description:
									'Retrouvez toutes les règles Urssaf pour l’économie collaborative.',
							}}
						/>
					</Grid>
				)}

				{key === 'salarié' && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<CodeDuTravailNumeriqueCard />
					</Grid>
				)}

				{iframePath && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={absoluteSitePaths}
						/>
					</Grid>
				)}
			</Grid>

			<Spacing lg />
		</section>
	)
}

const guidesUrssafList = [
	/* On désactive tous les guides Urssaf qui sont des documents non accessibles. */
	// {
	// 	url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/PAM/Diaporama_Medecins.pdf',
	// 	associatedRule: "dirigeant . indépendant . PL . métier = 'santé . médecin'",
	// 	title: 'Guide Urssaf pour les médecins libéraux',
	// },
	// {
	// 	url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_PL_statuts_hors_AE_et_PAM.pdf',
	// 	associatedRule: 'entreprise . activité . nature . libérale . réglementée',
	// 	title: 'Guide Urssaf pour les professions libérales réglementées',
	// },
	// {
	// 	url: 'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Urssaf-Guide-AutoEntrepreneur-metropole.pdf',
	// 	associatedRule: 'dirigeant . auto-entrepreneur',
	// 	title: 'Guide Urssaf pour les auto-entrepreneurs',
	// },
	// {
	// 	url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
	// 	associatedRule: 'dirigeant',
	// 	title: 'Guide Urssaf pour les indépendants',
	// },

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
				"dirigeant . indépendant . PL . métier != 'expert-comptable'",
				'dirigeant . indépendant . PL . PAMC = non',
			],
		},
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/service-autoentrepreneur.html',
		title: 'Le service en ligne Auto-entrepreneur',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: 'dirigeant . auto-entrepreneur',
	},
	{
		url: 'https://www.urssaf.fr/accueil/services/services-independants/mespremiersmois.html',
		title: 'Mes premiers mois avec l’Urssaf',
		description:
			'Un accompagnement tout au long des étapes clés de votre première année d’entrepreneuriat, pour réussir le lancement de votre entreprise.',
		associatedRule: {
			'une de ces conditions': [
				'dirigeant . auto-entrepreneur',
				'dirigeant . indépendant . PL',
			],
		},
	},

	{
		url: 'https://www.urssaf.fr/accueil/services/services-artisteauteur-diffuseur/service-artiste-auteur.html',
		title: 'Le service en ligne Artiste-auteur',
		description:
			"L'Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.",
		associatedRule: 'artiste-auteur',
	},
]

// const FAQAutoEntrepreneurArticle = () => {
// 	const { t } = useTranslation()

// 	return (
// 		<Article
// 			title={
// 				<h3>
// 					{t(
// 						'pages.common.ressources-auto-entrepreneur.FAQ.title',
// 						'Questions fréquentes'
// 					)}{' '}
// 					<Emoji emoji="❓" />
// 				</h3>
// 			}
// 			href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/une-question/questions-frequentes.html"
// 			ctaLabel={t(
// 				'pages.common.ressources-auto-entrepreneur.FAQ.cta',
// 				'Voir les réponses'
// 			)}
// 		>
// 			<Trans i18nKey="pages.common.ressources-auto-entrepreneur.FAQ.body">
// 				Une liste exhaustive et maintenue à jour de toutes les questions
// 				fréquentes (et moins fréquentes) que l'on est amené à poser en tant
// 				qu'auto-entrepreneur
// 			</Trans>
// 		</Article>
// 	)
// }
