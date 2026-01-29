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
import { useCurrentPath } from '@/lib/navigation'
import { Simulation } from '@/store/reducers/simulation.reducer'
import { Merge } from '@/types/utils'

import NextSteps from '../pages/simulateurs/NextSteps'
import { TrackChapter, TrackingChapters } from './ATInternetTracking'
import DateChip from './DateChip'

export default function SimulateurOrAssistantPage() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const pathname = useCurrentPath()
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

	const { chapter1, chapter2, chapter3 } = tracking as TrackingChapters

	const { ogTitle, ogDescription, ogImage } = meta as Merge<
		MergedSimulatorDataValues['meta']
	>

	return (
		<TrackChapter chapter1={chapter1} chapter2={chapter2} chapter3={chapter3}>
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
