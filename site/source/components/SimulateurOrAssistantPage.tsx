import { ComponentPropsWithoutRef } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import Meta from '@/components/utils/Meta'
import { Chip, Emoji, H1, Intro } from '@/design-system'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSetSimulationFromSearchParams from '@/hooks/useSetSimulationFromSearchParams'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { Simulation } from '@/store/reducers/simulation.reducer'
import { Merge } from '@/types/utils'

import NextSteps from '../pages/simulateurs/NextSteps'
import { TrackChapter } from './ATInternetTracking'
import DateChip from './DateChip'

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
		externalLinks,
		autoloadLastSimulation,
		path,
	} = currentSimulatorData

	const inIframe = useIsEmbedded()
	useSimulationConfig({
		key: path,
		config: simulation as Simulation,
		autoloadLastSimulation,
	})
	useSetSimulationFromSearchParams()

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
						<StyledSpan>{title}</StyledSpan> <DateChip />
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
						externalLinks={externalLinks}
					/>
				</>
			)}
		</TrackChapter>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
