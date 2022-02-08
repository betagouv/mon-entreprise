import { useIsEmbedded } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import useSearchParamsSimulationSharing from 'Components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { H1 } from 'DesignSystem/typography/heading'
import { Intro } from 'DesignSystem/typography/paragraphs'
import { ComponentPropsWithoutRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import { TrackChapter } from '../../../ATInternetTracking'
import { CurrentSimulatorDataProvider, SimulatorData } from '../metadata'
import { NextSteps } from './NextSteps'

export default function PageData(props: SimulatorData[keyof SimulatorData]) {
	const {
		meta,
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
	} = props
	let { title } = props

	const { année } = useSelector(situationSelector)
	const year = année != null && année != 2022 ? ' - ' + année : ''

	const inIframe = useIsEmbedded()
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
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	return (
		<CurrentSimulatorDataProvider value={props}>
			<TrackChapter {...trackInfo} />
			{meta && <Meta page={`simulateur.${title}`} {...meta} />}
			{title && !inIframe && (
				<>
					<H1>
						{title}
						{year}
					</H1>
					{tooltip && <Intro>{tooltip}</Intro>}
				</>
			)}
			{description && !inIframe && description}

			<Component />

			{!inIframe && (
				<>
					<section>{seoExplanations}</section>
					<NextSteps
						iframePath={privateIframe ? undefined : iframePath}
						nextSteps={nextSteps}
					/>
				</>
			)}
		</CurrentSimulatorDataProvider>
	)
}
