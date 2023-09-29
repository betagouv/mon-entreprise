import { ComponentPropsWithoutRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import Meta from '@/components/utils/Meta'
import useSearchParamsSimulationSharing from '@/components/utils/useSearchParamsSimulationSharing'
import { Chip } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { H1 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import {
	MergedSimulatorDataValues,
	useCurrentSimulatorData,
} from '@/hooks/useCurrentSimulatorData'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import { Merge } from '@/types/utils'

import { NextSteps } from '../pages/simulateurs/NextSteps'
import { TrackChapter } from './ATInternetTracking'

export default function SimulateurOrAssistantPage() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const { pathname, search } = useLocation()
	if (!currentSimulatorData) {
		throw new Error(`No simulator found with url: ${pathname}?${search}`)
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

	const situation = useSelector(situationSelector)
	const année =
		typeof situation.date === 'string' && new Date(situation.date).getFullYear()
	const year = typeof année === 'number' ? `Année ${année}` : ''

	const inIframe = useIsEmbedded()
	useSimulationConfig({
		key: path,
		config: simulation,
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
						{year && (
							<Chip type="secondary" icon={<Emoji emoji="📆" />}>
								{year}
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
