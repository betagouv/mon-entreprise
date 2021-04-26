import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
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

type NextStepsProps = {
	iframePath?: string
	nextSteps?: Array<SimulatorId>
}

function NextSteps({ iframePath, nextSteps }: NextStepsProps) {
	const sitePaths = useContext(SitePathsContext)
	const simulators = useSimulatorsData()
	if (!iframePath && !nextSteps) {
		return null
	}
	return (
		<section>
			<h3>Aller plus loin</h3>
			<div className="ui__ box-container">
				{nextSteps?.map((simulatorId) => (
					<SimulateurCard
						key={simulatorId}
						noBorder
						{...simulators[simulatorId]}
					/>
				))}
				{13 && (
					<Link
						className="ui__ interactive card box"
						to={{
							pathname: sitePaths.integration.iframe,
							search: `?module=${iframePath}`,
						}}
					>
						<div className="ui__ big box-icon">{emoji('📱')}</div>
						<h3>Intégrer le module web</h3>
						<p className="ui__ notice">
							Ajouter ce simulateur sur votre site internet en un clic
						</p>
					</Link>
				)}
			</div>
		</section>
	)
}
