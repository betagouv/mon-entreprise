import { Condition } from 'Components/EngineValue'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import useSearchParamsSimulationSharing from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { H1, H2, H3, H5 } from 'DesignSystem/typography/heading'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import { RessourceAutoEntrepreneur } from '../../pages/Créer/CreationChecklist'
import useSimulatorsData, { SimulatorData } from './metadata'

export default function PageData({
	meta,
	title,
	config,
	tracking,
	tooltip,
	description,
	iframePath,
	private: privateIframe,
	component: Component,
	seoExplanations,
	nextSteps,
	path,
}: SimulatorData[keyof SimulatorData]) {
	const inIframe = useContext(IsEmbeddedContext)
	const fromGérer = !!useLocation<{ fromGérer?: boolean }>().state?.fromGérer
	useSimulationConfig(config, { useExistingCompanyFromSituation: fromGérer })
	useSearchParamsSimulationSharing()

	// TODO : Move this logic elsewhere.
	//
	// Some user where expecting to be on a simulator for employers instead of the
	// one for employees coming from the page listing all incentives for
	// employers. This makes sense, but at the same time our main simulator works
	// for both employers and employees, so for now we just use a URL parameter
	// `?view=employeur` to cusomize the title of the page. We may want to provide
	// additional customization in the future depending to the targeted audience.
	const sitePaths = useContext(SitePathsContext)
	const view = new URLSearchParams(useLocation().search).get('view')
	const { t } = useTranslation()
	if (view === 'employeur' && path === sitePaths.simulateurs.salarié) {
		title = t(
			'pages.simulateurs.salarié.title-employeur',
			"Simulateur de coûts d'embauche"
		)
	}

	const trackInfo = {
		chapter1:
			typeof tracking === 'string' || !('chapter1' in tracking)
				? ('simulateurs' as const)
				: tracking.chapter1,
		...(typeof tracking === 'string'
			? {
					chapter2: tracking,
			  }
			: tracking),
	}
	return (
		<>
			<TrackChapter {...trackInfo} />
			{meta && <Meta {...meta} />}
			{title && !inIframe && (
				<>
					<H1>{title}</H1>
					{tooltip && (
						<H2>
							<small>{tooltip}</small>
						</H2>
					)}
				</>
			)}
			{description && !inIframe && description}

			<ThemeColorsProvider color={inIframe ? undefined : meta?.color}>
				<Component />

				{config && <PreviousSimulationBanner />}
				{!inIframe && (
					<>
						<section>{seoExplanations}</section>
						<NextSteps
							iframePath={privateIframe ? undefined : iframePath}
							nextSteps={nextSteps}
						/>
					</>
				)}
			</ThemeColorsProvider>
		</>
	)
}

type NextStepsProps = Pick<
	SimulatorData[keyof SimulatorData],
	'iframePath' | 'nextSteps'
>

function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const sitePaths = useContext(SitePathsContext)
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const guideUrssaf = guidesUrssaf.find(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !nextSteps && !guideUrssaf) {
		return null
	}
	return (
		<section className="ui__ print-display-none">
			<H3 as="h2">
				<Trans>Ressources utiles</Trans>
			</H3>
			<div className="ui__ box-container">
				<Condition expression="dirigeant . auto-entrepreneur">
					<RessourceAutoEntrepreneur />
				</Condition>
				{guideUrssaf && language === 'fr' && (
					<a
						className="ui__ interactive card box lighter-bg thinner"
						href={guideUrssaf.url}
						target="_blank"
					>
						<H5 as="h3">
							<Emoji emoji="📖" /> {guideUrssaf.title}
						</H5>
						<p className="ui__ notice">
							Des conseils pour se lancer dans la création et une présentation
							détaillée de votre protection sociale.
						</p>
						<small className="ui__ small label">PDF</small>
					</a>
				)}
				{nextSteps?.map((simulatorId) => (
					<SimulatorRessourceCard key={simulatorId} simulatorId={simulatorId} />
				))}
				{iframePath && (
					<Link
						className="ui__ interactive card lighter-bg box thinner"
						to={{
							pathname: sitePaths.integration.iframe,
							search: `?module=${iframePath}`,
						}}
					>
						<Trans i18nKey="nextSteps.integration-iframe">
							<H5 as="h3">
								<Emoji emoji="📱" /> Intégrer le module web
							</H5>
							<p className="ui__ notice">
								Ajouter ce simulateur sur votre site internet en un clic via un
								script clé en main.
							</p>
						</Trans>
					</Link>
				)}
			</div>
		</section>
	)
}

type SimulatorRessourceCardProps = {
	simulatorId: keyof SimulatorData
}

export function SimulatorRessourceCard({
	simulatorId,
}: SimulatorRessourceCardProps) {
	const simulator = useSimulatorsData()[simulatorId]
	return (
		<Link
			className="ui__ interactive card lighter-bg box thinner"
			to={{
				state: { fromSimulateurs: true },
				pathname: simulator.path,
			}}
		>
			<H5 as="h3">
				{simulator.icône && <Emoji emoji={simulator.icône} />}{' '}
				{simulator.shortName}
			</H5>
			<p className="ui__ notice">{simulator.meta?.description}</p>
		</Link>
	)
}

const guidesUrssaf = [
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_Medecins.pdf',
		associatedRule: "dirigeant . indépendant . PL . métier = 'santé . médecin'",
		title: 'Guide Urssaf pour les médecins libéraux',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_PL_statuts_hors_AE_et_PAM.pdf',
		associatedRule: 'entreprise . activité . libérale réglementée',
		title: 'Guide Urssaf pour les professions libérales réglementées',
	},
	{
		url: 'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Metropole/Presentation_AE.pdf',
		associatedRule: 'dirigeant . auto-entrepreneur',
		title: 'Guide Urssaf pour les auto-entrepreneurs',
	},
	{
		url: 'http://www.secu-artistes-auteurs.fr/sites/default/files/pdf/Guide%20pratique%20de%20d%C3%A9but%20d%27activit%C3%A9.pdf',
		associatedRule: "dirigeant = 'artiste-auteur'",
		title: 'Guide Urssaf pour les artistes-auteurs',
	},
	{
		url: 'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
		associatedRule: 'dirigeant',
		title: 'Guide Urssaf pour les indépendants',
	},
]
