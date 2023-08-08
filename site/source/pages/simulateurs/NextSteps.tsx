import { Trans, useTranslation } from 'react-i18next'

import { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import { Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { GuideURSSAFCard } from '@/pages/simulateurs/cards/GuideURSSAFCard'
import { IframeIntegrationCard } from '@/pages/simulateurs/cards/IframeIntegrationCard'
import { useSitePaths } from '@/sitePaths'
import {
	usePromiseOnSituationChange,
	useWorkerEngine,
} from '@/worker/socialWorkerEngineClient'

import { AnnuaireEntreprises } from '../assistants/pour-mon-entreprise/AnnuaireEntreprises'
import { AutoEntrepreneurCard } from '../assistants/pour-mon-entreprise/AutoEntrepeneurCard'
import { CodeDuTravailNumeriqueCard } from '../assistants/pour-mon-entreprise/CodeDuTravailNumeriqueCard'
import { SimulatorRessourceCard } from './cards/SimulatorRessourceCard'

interface NextStepsProps {
	iframePath?: MergedSimulatorDataValues['iframePath']
	nextSteps: MergedSimulatorDataValues['nextSteps']
}

export function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { language } = useTranslation().i18n
	const workerEngine = useWorkerEngine()

	const { key } = useCurrentSimulatorData()
	const guideUrssaf = usePromiseOnSituationChange(
		async () =>
			(
				await Promise.all(
					guidesUrssaf.map(({ associatedRule }) =>
						workerEngine.asyncEvaluate(associatedRule)
					)
				)
			).find(({ nodeValue }) => nodeValue),
		[workerEngine]
	)

	if (!iframePath && !guideUrssaf) {
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
							{/* <SimulatorRessourceCard simulatorId={simulatorId} /> */}
						</Grid>
					))}

				{iframePath && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<IframeIntegrationCard
							iframePath={iframePath}
							sitePaths={absoluteSitePaths}
						/>
					</Grid>
				)}
				{/* {key === 'salarié' && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						<CodeDuTravailNumeriqueCard />
					</Grid>
				)} */}
				{guideUrssaf && language === 'fr' && (
					<Grid item xs={12} sm={6} lg={4} role="listitem">
						{/* <GuideURSSAFCard guideUrssaf={guideUrssaf} /> */}
					</Grid>
				)}
			</Grid>

			<Spacing lg />
		</section>
	)
}

const guidesUrssaf = [
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
		url: 'https://www.urssaf.fr/portail/home/employeur/employer-du-personnel/nouvel-employeur.html',
		title: "Nouvel employeur : l'Urssaf vous accompagne",
		description:
			'Vous créez votre premier emploi ? Découvrez le service Urssaf Première Embauche, un accompagnement personnalisé et entièrement gratuit pendant un an.',
		associatedRule: {
			'toutes ces conditions': [
				'dirigeant = non',
				{ 'est non défini': 'artiste-auteur' },
			],
		},
		ctaLabel: 'En savoir plus',
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
