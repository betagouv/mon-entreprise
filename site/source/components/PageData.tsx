import { useIsEmbedded } from '@/components/utils/embeddedContext'
import Meta from '@/components/utils/Meta'
import useSearchParamsSimulationSharing from '@/components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Spacing } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { situationSelector } from '@/selectors/simulationSelectors'
import { ComponentPropsWithoutRef } from 'react'
import { useSelector } from 'react-redux'
import { TrackChapter } from '../ATInternetTracking'
import {
	CurrentSimulatorDataProvider,
	ExtractFromSimuData,
} from '../pages/Simulateurs/metadata'
import { NextSteps } from '../pages/Simulateurs/NextSteps'

export interface PageDataProps {
	meta: ExtractFromSimuData<'meta'>
	config?: ExtractFromSimuData<'config'>
	tracking: ExtractFromSimuData<'tracking'>
	tooltip?: ExtractFromSimuData<'tooltip'>
	description?: ExtractFromSimuData<'description'>
	iframePath?: ExtractFromSimuData<'iframePath'>
	seoExplanations?: ExtractFromSimuData<'seoExplanations'>
	nextSteps?: ExtractFromSimuData<'nextSteps'>
	path: ExtractFromSimuData<'path'>
	title: ExtractFromSimuData<'title'>
	private?: ExtractFromSimuData<'private'>
	component: ExtractFromSimuData<'component'>
	icône: ExtractFromSimuData<'icône'>
	pathId: ExtractFromSimuData<'pathId'>
	shortName: ExtractFromSimuData<'shortName'>
}

export default function PageData(props: PageDataProps) {
	const {
		meta,
		config,
		title,
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

	const année = useSelector(situationSelector)['année']
	const year =
		typeof année === 'number' && année !== 2022 ? ` - version ${année}` : ''

	const inIframe = useIsEmbedded()
	useSimulationConfig(config, { path })
	useSearchParamsSimulationSharing()

	const trackInfo = {
		chapter1:
			typeof tracking === 'string' || !('chapter1' in tracking)
				? ('simulateurs' as const)
				: tracking.chapter1,
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	return (
		<CurrentSimulatorDataProvider value={props}>
			<TrackChapter {...trackInfo}>
				{meta && <Meta page={`simulateur.${title ?? ''}`} {...meta} />}
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

						<Spacing lg />
					</>
				)}
			</TrackChapter>
		</CurrentSimulatorDataProvider>
	)
}
