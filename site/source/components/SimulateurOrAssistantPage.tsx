import { ComponentPropsWithoutRef } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import Meta from '@/components/utils/Meta'
import { Chip } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { H1 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import useDate from '@/hooks/useDate'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSearchParamsSimulationSharing from '@/hooks/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { Simulation } from '@/store/reducers/simulation.reducer'
import { Merge } from '@/types/utils'

import { NextSteps } from '../pages/simulateurs/NextSteps'
import { TrackChapter } from './ATInternetTracking'

export default function SimulateurOrAssistantPage() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { pathname } = useLocation()
	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${pathname}`)
	}
	const {
		meta,
		simulation,
		title,
		tracking,
		tooltip,
		beta,
		iframePath,
		private: privateIframe,
		component: Component,
		seoExplanations: SeoExplanations,
		nextSteps,
		autoloadLastSimulation,
		path,
	} = currentSimulatorData

	const engineDate = useDate()
	const date = engineDate?.toString().slice(-7)

	const inIframe = useIsEmbedded()
	useSimulationConfig({
		key: path,
		config: simulation as Simulation,
		autoloadLastSimulation,
	})
	useSearchParamsSimulationSharing()

	const trackInfo = {
		chapter1:
			typeof tracking !== 'string' && tracking && 'chapter1' in tracking
				? tracking.chapter1
				: ('simulateurs' as const),
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	const { ogTitle, ogDescription, ogImage } = meta as Merge<
		MergedSimulatorDataValues['meta']
	>

	return (
		<TrackChapter {...trackInfo}>
			{meta && (
				<Meta
					title={meta.title}
					description={meta.description}
					ogTitle={ogTitle}
					ogDescription={ogDescription}
					ogImage={ogImage}
				/>
			)}

			{/* {beta && <BetaBanner />} */}

			{title && !inIframe && (
				<>
					<H1>
						<StyledSpan>{title}</StyledSpan>{' '}
						{date && (
							<Chip type="secondary" icon={<Emoji emoji="📆" />}>
								{date}
							</Chip>
						)}
						{beta && (
							<Chip type="info" icon={<Emoji emoji="🚧" />}>
								Version bêta
							</Chip>
						)}
					</H1>
					{tooltip && <Intro>{tooltip}</Intro>}
				</>
			)}

			<Component />

			{!inIframe && (
				<>
					{SeoExplanations && (
						<section>
							<SeoExplanations />
						</section>
					)}
					<NextSteps
						iframePath={privateIframe ? undefined : iframePath}
						nextSteps={nextSteps}
					/>
				</>
			)}
		</TrackChapter>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
