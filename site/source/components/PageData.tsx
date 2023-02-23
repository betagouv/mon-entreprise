import { ComponentPropsWithoutRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Meta from '@/components/utils/Meta'
import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import useSearchParamsSimulationSharing from '@/components/utils/useSearchParamsSimulationSharing'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Chip } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { situationSelector } from '@/selectors/simulationSelectors'

import { NextSteps } from '../pages/Simulateurs/NextSteps'
import { TrackChapter } from './ATInternetTracking'
import BetaBanner from './BetaBanner'

export default function PageData() {
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
		path,
	} = currentSimulatorData

	const situation = useSelector(situationSelector)
	const année =
		typeof situation.date === 'string' && new Date(situation.date).getFullYear()
	const year = typeof année === 'number' ? `Année ${année}` : ''

	const inIframe = useIsEmbedded()
	useSimulationConfig({ path, config: simulation })
	useSearchParamsSimulationSharing()

	const trackInfo = {
		chapter1:
			typeof tracking !== 'string' && tracking && 'chapter1' in tracking
				? tracking.chapter1
				: ('simulateurs' as const),
		...(typeof tracking === 'string' ? { chapter2: tracking } : tracking),
	} as ComponentPropsWithoutRef<typeof TrackChapter>

	return (
		<TrackChapter {...trackInfo}>
			{meta && <Meta page={`simulateur.${title ?? ''}`} {...meta} />}

			{beta && <BetaBanner />}
			{title && !inIframe && (
				<>
					<H1>
						<StyledSpan>{title}</StyledSpan>
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

					<Spacing lg />
				</>
			)}
		</TrackChapter>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.sm};
`
