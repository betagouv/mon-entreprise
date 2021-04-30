import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { useEngine } from 'Components/utils/EngineContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import useSearchParamsSimulationSharing from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { default as React, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import { SimulateurCard } from './Home'
import useSimulatorsData, { SimulatorData, SimulatorId } from './metadata'

export default function PageData({
	meta,
	title,
	config,
	tracking,
	tooltip,
	description,
	iframePath,
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
					<h1>{title}</h1>
					{tooltip && (
						<h2
							css={`
								margin-top: 0;
							`}
						>
							<small>{tooltip}</small>
						</h2>
					)}
				</>
			)}
			{description && !inIframe && description}

			<ThemeColorsProvider color={inIframe ? undefined : meta?.color}>
				<Component />
				{config && <PreviousSimulationBanner />}
				{!inIframe && (
					<>
						{seoExplanations}
						<NextSteps iframePath={iframePath} nextSteps={nextSteps} />
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
	const simulators = useSimulatorsData()
	const { language } = useTranslation().i18n
	const engine = useEngine()

	const guideUrssaf = guidesUrssaf.find(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	)

	if (!iframePath && !nextSteps && !guideUrssaf) {
		return null
	}
	return (
		<section>
			<h3>Aller plus loin</h3>
			<div className="ui__ full-width ">
				<div className="ui__ box-container center-flex">
					{guideUrssaf && language === 'fr' && (
						<a
							className="ui__ interactive card box thiner"
							href={guideUrssaf.url}
							target="_blank"
						>
							<h5>
								<span className="ui__ box-icon">{emoji('📖')}</span>{' '}
								{guideUrssaf.title}
							</h5>
							<p className="ui__ notice">
								Des conseils pour se lancer dans la création et une présentation
								détaillée de votre protection sociale.
							</p>
							<small className="ui__ label">PDF</small>
						</a>
					)}
					{nextSteps?.map((simulatorId) => (
						<Link
							key={simulatorId}
							className="ui__ interactive card box thiner"
							to={{
								state: { fromSimulateurs: true },
								pathname: simulators[simulatorId].path,
							}}
						>
							<h5>
								<span className="ui__ box-icon">
									{emoji(simulators[simulatorId].icône)}
								</span>
								{simulators[simulatorId].shortName}
							</h5>
							<p className="ui__ notice">
								{simulators[simulatorId].meta?.description}
							</p>
						</Link>
					))}
					{iframePath && (
						<Link
							className="ui__ interactive card box thiner"
							to={{
								pathname: sitePaths.integration.iframe,
								search: `?module=`,
							}}
						>
							<h5>
								<span className="ui__ box-icon">{emoji('📱')}</span> Intégrer le
								module web
							</h5>
							<p className="ui__ notice">
								Ajouter ce simulateur sur votre site internet en un clic
							</p>
						</Link>
					)}
				</div>
			</div>
		</section>
	)
}

const guidesUrssaf = [
	{
		url:
			'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_Medecins.pdf',
		associatedRule: "dirigeant . indépendant . PL . métier = 'santé . médecin'",
		title: 'Guide Urssaf pour les médecins libéraux',
	},
	{
		url:
			'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_PL_statuts_hors_AE_et_PAM.pdf',
		associatedRule: 'entreprise . activité . libérale réglementée',
		title: 'Guide Urssaf pour les professions libérales réglementées',
	},
	{
		url:
			'https://www.autoentrepreneur.urssaf.fr/portail/files/Guides/Metropole/Presentation_AE.pdf',
		associatedRule: 'dirigeant . auto-entrepreneur',
		title: 'Guide Urssaf pour les auto-entrepreneurs',
	},
	{
		url:
			'https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/Diaporama_TI_statuts_hors_AE.pdf',
		associatedRule: 'dirigeant',
		title: 'Guide Urssaf pour les indépendants',
	},
]
