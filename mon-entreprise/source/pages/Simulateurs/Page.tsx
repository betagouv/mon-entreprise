import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import useSearchParamsSimulationSharing from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { default as React, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
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
	iframe,
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
						<NextSteps iframe={iframe} nextSteps={nextSteps} />
					</>
				)}
			</ThemeColorsProvider>
		</>
	)
}

type NextStepsProps = {
	iframe?: string
	nextSteps?: Array<SimulatorId>
}

function NextSteps({ iframe, nextSteps }: NextStepsProps) {
	const sitePaths = useContext(SitePathsContext)
	const simulators = useSimulatorsData()
	if (!iframe && !nextSteps) {
		return null
	}
	return (
		<section>
			<h3>Aller plus loin</h3>
			<div className="ui__ box-container">
				{nextSteps?.map((simulatorId) => (
					<SimulateurCard key={simulatorId} {...simulators[simulatorId]} />
				))}
				{iframe && (
					<Link
						className="ui__ interactive card box light-border"
						to={{
							pathname: sitePaths.integration.iframe,
							search: `?module=${iframe}`,
						}}
					>
						<div className="ui__ big box-icon">{emoji('📱')}</div>
						<Trans i18nKey="pages.simulateurs.cartes.intégrer module web">
							<h3>Intégrer le module web</h3>
							<p className="ui__ notice">
								Ajouter ce simulateur sur votre site internet en un clic
							</p>
						</Trans>
					</Link>
				)}
			</div>
		</section>
	)
}
